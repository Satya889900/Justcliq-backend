import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { fetchApprovedProvidersByServiceName } from "../repository/serviceprovider.repository.js";

export const adminGetProvidersByServiceNameController = asyncHandler(
  async (req, res) => {
    const { serviceName } = req.params;

    let providers = await fetchApprovedProvidersByServiceName(serviceName);

    // ⭐ Sort: Justcliq FIRST
    providers.sort((a, b) => {
      const A = a.name?.toLowerCase().includes("justcliq");
      const B = b.name?.toLowerCase().includes("justcliq");

      if (A && !B) return -1;
      if (!A && B) return 1;
      return 0;
    });

    return res.json(
      new ApiResponse(
        200,
        providers,
        `Providers for '${serviceName}' fetched successfully (Admin Only)`
      )
    );
  }
);
