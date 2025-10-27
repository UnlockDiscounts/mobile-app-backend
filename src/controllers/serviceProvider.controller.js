import Provider from "../models/serviceProvider.model.js"
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const signup = async (req, res) => {
  try {
    const { business_name, fullname, phone_number, email, password, service_category, sub_category } = req.body;

    if (!email || !password || !fullname || !business_name) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    const existingProvider = await Provider.findOne({ email });
    if (existingProvider) {
      return res.status(400).json({ message: "Provider already exists with this email" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newProvider = new Provider({
      business_name,
      fullname,
      phone_number,
      email,
      password: hashedPassword,
      service_category,
      sub_category
    });

    await newProvider.save();
    res.status(201).json({ message: "Provider registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const provider = await Provider.findOne({ email });
    console.log(provider)
    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }

    const isMatch = await bcrypt.compare(password, provider.password);
    console.log(isMatch)
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: provider._id, email: provider.email }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.json({
      message: "Login successful",
      token,
      provider: {
        id: provider._id,
        fullname: provider.fullname,
        email: provider.email,
        phone_number: provider.phone_number
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};