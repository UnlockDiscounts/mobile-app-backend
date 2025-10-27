import {body} from "express-validator";
export const signupValidator = [
  body("name")
    .notEmpty().withMessage("Name is required")
    .isLength({ min: 2 }).withMessage("Name must be at least 2 characters long"),

  body("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email format"),

  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),

  body("role")
    .notEmpty().withMessage("Role is required")
    .isIn(["customer", "provider"]).withMessage("Role must be either customer or provider"),

  body("phone_number").custom((value, { req }) => {
    if (req.body.role === "provider" && !value) {
      throw new Error("Phone number is required for providers");
    }
    return true;
  }),

  body("address").custom((value, { req }) => {
    if (req.body.role === "provider" && !value) {
      throw new Error("Address is required for providers");
    }
    return true;
  }),

  body("providerDetails").custom((value, { req }) => {
    if (req.body.role === "provider") {
      if (!value) {
        throw new Error("Provider details are required");
      }

      const requiredFields = ["business_name", "service_category", "services"];
      requiredFields.forEach(field => {
        if (!value[field] || (Array.isArray(value[field]) && value[field].length === 0)) {
          throw new Error(`Provider field '${field}' is required`);
        }
      });

      value.services.forEach((service, index) => {
        if (!service.serviceName) throw new Error(`Service name is required at index ${index}`)
        });
    }
    return true;
  }),
];

export const loginValidator = [
  body("email")
  .notEmpty().withMessage("Email is required")
  .isEmail().withMessage("Invalid Email formate"),

  body("password")
  .notEmpty().withMessage("Password is required")
  .isLength({min:6}).withMessage("Password must be at least of 6 characters")
]