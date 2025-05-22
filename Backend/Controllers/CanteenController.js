const CanteenItem = require("../Models/CanteenItemModel");
const Order = require("../Models/CanteenOrderModel");


const addItem = async (req, res) => {
  const { name, amountAvailable, price, companyName , preparationTime } = req.body;
try {
    const newItem = await CanteenItem.create({
      name,
      amountAvailable,
      price,
      companyName,
      preparationTime,
    });
    res.status(201).json({ message: "Item added successfully", item: newItem });
  } catch (error) {
    res.status(400).json({ message: "Error adding item", error });
  }
};



const deleteItem = async (req, res) => {
  const { itemId } = req.params;

  try {
    await CanteenItem.findByIdAndDelete(itemId);
    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Error deleting item", error });
  }
};



const getItems = async (req, res) => {
  try {
    const items = await CanteenItem.find();
    res.status(200).json(items);
  } catch (error) {
    res.status(400).json({ message: "Error fetching items", error });
  }
};



const placeOrder = async (req, res) => {
  const { studentName, semester, department, itemId, amount, location } =
    req.body;
  console.log("Data inside payload is", req.body);
const newOrder = new Order({
    item: itemId,
    amount,
    location,
    status: "Pending",
    semester,
    department,
    studentName,
  });

  try {
    await newOrder.save();
    res.status(201).json({ message: "Order placed successfully" });
  } catch (error) {
    console.log("Got error in placeOrder function that is", error);
    res.status(500).json({ message: "Error placing order" });
  }
};


const getNewOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("item", "name");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders", error });
  }
};




module.exports = { addItem , deleteItem, getItems , getNewOrders  , placeOrder};
