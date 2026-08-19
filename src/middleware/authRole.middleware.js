import { apiError } from "../utility/apiError";

export const authRole = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      const user = req.user;

      if (!user) {
        throw new apiError(401, "Authentication required: Login first");
      }

      const userRole = user.userType.userRole;

      if (!allowedRoles.includes(userRole)) {
        throw new apiError(
          403,
          `Access Denied: ${userRole} is not authoriized to access this resource`,
        );
      }

      next();
    } catch (error) {
      console.log(error.message);
    }
  };
};
