import Provider from "../models/serviceProvider.model.js"
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mongoose from "mongoose";

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



export const addService = async (req, res) => {
  try {
    const { providerId } = req.params;
    const { serviceName, price } = req.body;

    const provider = await Provider.findById(providerId);
    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }

    provider.services.push({ serviceName, price });
    await provider.save();

    res.status(201).json({ message: "Service added successfully", services: provider.services });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getServices = async (req, res) => {
  try {
    const providers = await Provider.find({}, { services: 1, fullname: 1, business_name: 1, _id: 1 });

    const allServices = providers.flatMap(provider =>
      provider.services.map(service => ({
        providerId: provider._id,
        providerName: provider.fullname,
        businessName: provider.business_name,
        serviceName: service.serviceName,
        price: service.price,
        serviceId:service._id
      }))
    );

    res.status(200).json(allServices);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const updateService = async (req, res) => {
  try {
    const { providerId, serviceId } = req.params;
    const { serviceName, price } = req.body;

    const provider = await Provider.findById(providerId);
    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }

    const service = provider.services.id(serviceId);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    if (serviceName) service.serviceName = serviceName;
    if (price) service.price = price;

    await provider.save();

    res.status(200).json({
      message: "Service updated successfully",
      services: provider.services
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteService = async (req, res) => {
  try {
    const { providerId, serviceId } = req.params;

    // validate ids
    if (!mongoose.Types.ObjectId.isValid(providerId) || !mongoose.Types.ObjectId.isValid(serviceId)) {
      return res.status(400).json({ message: "Invalid providerId or serviceId" });
    }

    // Don't use .lean() here — we want a mongoose document so subdoc helpers work
    const provider = await Provider.findById(providerId);
    if (!provider) return res.status(404).json({ message: "Provider not found" });

    // Try to find subdoc by id (this returns a Mongoose subdocument if provider is a doc)
    const service = provider.services.id(serviceId);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    // If subdocument has remove() method (Mongoose subdoc), use it
    if (typeof service.remove === "function") {
      service.remove();
    } else {
      // Fallback: services might be plain objects — filter them out
      provider.services = provider.services.filter(
        (s) => s._id.toString() !== serviceId.toString()
      );
    }

    await provider.save();

    return res.status(200).json({
      message: "Service deleted successfully",
      services: provider.services,
    });
  } catch (err) {
    console.error("deleteService error:", err);
    return res.status(500).json({ error: err.message });
  }
};

export const updateExperience = async (req, res) => {
  try {
    const { providerId } = req.params;
    const { experience } = req.body;

    const provider = await Provider.findByIdAndUpdate(
      providerId,
      { experience },
      { new: true }
    );

    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }

    res.status(200).json({ message: "Experience updated successfully", experience: provider.experience });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
