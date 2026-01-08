import Order from "../models/Order.js";
import Combo from "../models/Combo.js";

export const placeOrder = async (req, res) => {
  const { comboId, deliveryAddress } = req.body;

  try {
    const combo = await Combo.findById(comboId);
    if (!combo) return res.status(404).json({ error: "Combo not found" });

    const order = await Order.create({
      buyerId: req.user.id,
      sellerId: combo.sellerId,
      comboId: combo._id,
      deliveryAddress
    });

    res.status(201).json({ message: "Order placed", order });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updateStatus = async (req, res) => {
  const { status, note } = req.body;

  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ error: "Order not found" });

    order.status = status;
    if (note) order.inspectionNote = note;

    await order.save();
    res.json({ message: "Status updated", order });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
