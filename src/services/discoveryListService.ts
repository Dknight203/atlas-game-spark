
import type { DiscoveryList, DiscoveryFilters } from "@/types/discovery";

export class DiscoveryListService {
  static generateId(): string {
    return Math.random().toString(36).substring(7);
  }

  static createDiscoveryList(
    projectId: string,
    name: string,
    description: string,
    filters: DiscoveryFilters
  ): DiscoveryList {
    const now = new Date().toISOString();
    
    return {
      id: this.generateId(),
      project_id: projectId,
      name,
      description: description || "",
      filters,
      is_public: false,
      created_at: now,
      updated_at: now,
    };
  }

  static updateDiscoveryList(
    list: DiscoveryList,
    updates: Partial<DiscoveryList>
  ): DiscoveryList {
    return {
      ...list,
      ...updates,
      updated_at: new Date().toISOString(),
    };
  }
}
