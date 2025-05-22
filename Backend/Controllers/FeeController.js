const Fee = require('../Models/FeeModel');
const User = require('../Models/UserModel');


const submitFeeDetails = async (req, res) => {
    const { userId, bankAccount, accountHolderName, paymentDate } = req.body;
    const screenshot = req.file?.path;

    try {
        const fee = new Fee({ userId, bankAccount, accountHolderName, paymentDate, screenshot });
        await fee.save();

        await User.findByIdAndUpdate(userId, { isFeesPaid: true, feesId: fee._id });

        res.status(201).json({ message: 'Fee details submitted successfully!', fee });
    } catch (error) {
        console.error('Error submitting fee details:', error);
        res.status(500).json({ message: 'Failed to submit fee details. Please try again.' });
    }
};

module.exports = { submitFeeDetails };
