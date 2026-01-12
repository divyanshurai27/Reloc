export const getAllCombos = async (req, res) => {
  try {
    const filter = {};

    if (req.query.city) {
      filter.city = req.query.city;
    }

    const combos = await Combo.find(filter).sort({ createdAt: -1 });
    res.json(combos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
