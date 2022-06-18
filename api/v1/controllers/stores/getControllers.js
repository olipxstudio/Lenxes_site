const { clientError, serverError } = require("../../02_utils/common");
const { path } = require("@ffmpeg-installer/ffmpeg");
const User = require("../../models/users/User");
const Category = require("../../models/stores/Category");
const Subcategory = require("../../models/stores/Subcategory");
const Subsetcategory = require("../../models/stores/Subsetcategory");
const Product = require("../../models/stores/Product");

// get all store categories
// @desc: get all store categories || @route: GET /api/stores/get/getAllStoreCategories  || @access:user
exports.getAllStoreCategories = async (req, res) => {
  const { _id } = req.user;
  const { store_id } = req.body;
  try {
    const result = await Category.find(
      {
        $and: [{ store: store_id }, { status: "active" }],
      },
      "name has_sub product_count"
    );
    const sub = await Promise.all(
      result.map(async (cat) => {
        const subcat = await Subcategory.find(
          {
            $and: [
              { store: store_id },
              { category: cat._id },
              { status: "active" },
            ],
          },
          "name has_set"
        );
        const set = await Promise.all(
          subcat.map(async (subcat) => {
            const setcat = await Subsetcategory.find(
              {
                $and: [
                  { store: store_id },
                  { subcategory: subcat._id },
                  { status: "active" },
                ],
              },
              "name"
            );
            return { ...subcat.toJSON(), subsetcategory: setcat };
          })
        );
        return { ...cat.toJSON(), subcategory: set };
      })
    );
    res.status(200).json({
      success: true,
      count: result?.length,
      data: sub,
    });
  } catch (error) {
    serverError(res, error);
  }
};

// get all store sub categories
// @desc: get all store sub categories || @route: GET /api/stores/get/getAllStoreSub_Categories  || @access:user
exports.getAllStoreSub_Categories = async (req, res) => {
  const { _id } = req.user;
  const { store_id, category_id } = req.body;
  try {
    const result = await Subcategory.find(
      {
        $and: [
          { store: store_id },
          { category: category_id },
          { status: "active" },
        ],
      },
      "name has_set"
    );
    res.status(200).json({
      success: true,
      count: result?.length,
      data: result,
    });
  } catch (error) {
    serverError(res, error);
  }
};

// get all store sub set categories
// @desc: get all store sub set categories || @route: GET /api/stores/get/getAllStoreSub_SetCategories  || @access:user
exports.getAllStoreSub_SetCategories = async (req, res) => {
  const { _id } = req.user;
  const { store_id, subcategory_id } = req.body;
  try {
    const result = await Subcategory.find(
      {
        $and: [
          { store: store_id },
          { subcategory: subcategory_id },
          { status: "active" },
        ],
      },
      "name"
    );
    res.status(200).json({
      success: true,
      count: result?.length,
      data: result,
    });
  } catch (error) {
    serverError(res, error);
  }
};

// get all store product
// @desc: get all store products || @route: GET /api/stores/get/store/products  || @access:user
exports.getProducts = async (req, res) => {
  const { _id } = req.user;
  try {
    const result = await Product.find({ user: _id }).sort("-date");
    res.status(200).json({
      success: true,
      count: result?.length,
      data: result,
    });
  } catch (error) {
    serverError(res, error);
  }
};
