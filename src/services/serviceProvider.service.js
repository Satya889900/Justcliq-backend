// services/serviceProvider.service.js
import { ApiError } from "../utils/ApiError.js";
import {
   getServiceProvidersWithActions ,
  updateServiceProviderAction,
  createServiceProviderAction,
  findServiceWithUser,
  findServiceProviderByServiceId,
 fetchApprovedProvidersByServiceName,
} from "../repository/serviceprovider.repository.js";


export const getServiceProvidersListService = async () => {
  const providers = await getServiceProvidersWithActions();

  if (!providers || providers.length === 0) {
    throw new ApiError(404, "Service not found");
    return []; // Return an empty array instead of throwing an error
  }

  return providers;
};


export const updateServiceProviderActionService = async (serviceId, action, reason) => {
  if (!action || !reason) throw new ApiError(400, "Action and reason are required");

  const allowedActions = ["Pending", "Approved", "Disapproved", "Suspended"];
  if (!allowedActions.includes(action)) {
    throw new ApiError(400, `Action must be one of: ${allowedActions.join(", ")}`);
  }

  // Fetch service to get userId
  const service = await findServiceWithUser(serviceId);
  if (!service) throw new ApiError(404, "Service not found");

  // const userId = service.user;

  let provider = await findServiceProviderByServiceId(serviceId);

  if (provider) {
    provider = await updateServiceProviderAction(provider._id, action, reason);
  } else {
      const userId = service.user?._id || service.userId; // get userId from service or serviceDetails
    provider = await createServiceProviderAction({ userId, serviceId, action, reason });
  }

  return provider;
};



export const getApprovedProvidersByServiceNameService = async (serviceName) => {
  if (!serviceName) throw new ApiError(400, "Service name is required");

  const providers = await fetchApprovedProvidersByServiceName(serviceName);

  if (!providers || providers.length === 0)
    throw new ApiError(404, "No approved providers found for this service");

  return providers;
};

