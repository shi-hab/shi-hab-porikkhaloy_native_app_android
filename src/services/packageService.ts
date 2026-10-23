import { apiClient } from "./apiClient";
import { ModelTest, Package } from "../types/package";

export const packageService = {
  async getAllPackages(): Promise<Package[]> {
    const response = await apiClient.get<Package[]>("/packages");
    return response.data;
  },

  async getPackageById(id: number | string): Promise<Package> {
    const response = await apiClient.get<Package>(`/packages/${id}`);
    return response.data;
  },

  async getPackageBySlug(slug: string): Promise<Package> {
    const response = await apiClient.get<Package>(`/packages/slug/${slug}`);
    return response.data;
  },

  async getModelTestsByPackageId(packageId: number | string): Promise<ModelTest[]> {
    const response = await apiClient.get<ModelTest[]>(
      `/packages/${packageId}/model-tests`
    );
    return response.data;
  },

  async getExamsUnderModelTest(modelTestId: number | string): Promise<any[]> {
    const response = await apiClient.get(`/model-test-exams/${modelTestId}`);
    return response.data;
  },

  async subscribe(packageId: number | string, paymentMethod?: string): Promise<{ payment_url?: string; status: boolean }> {
    const response = await apiClient.post("/pay", {
      package_id: packageId,
      payment_method: paymentMethod || "bkash",
    });
    return response.data;
  },
};
