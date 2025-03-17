const User = require("../Models/User");

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "customer" }).select("-password");

    res.status(200).json({
      status: "success",
      results: users.length,
      data: {
        users,
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      status: "error",
      message: "An error occurred while fetching users",
    });
  }
};

exports.changeStatus = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({status: 0, message:"User not found"});
    }

    user.status = user.status === "enabled" ? "disabled" : "enabled";

    await user.save();

    res.status(200).json({status: 1, message: "User status updated successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};
