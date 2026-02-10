import axiosInstance from "./axiosInstance";
import type { SubjectKey, SubjectKey1 } from "../components/SubjectAddButton";

export interface ResourceWorksheet {
  fileId: number;
  fileName: string;
  fileContentType: string;
}

export interface ResourceColumnLink {
  link: string;
}

export interface ResourceItem {
  resourceId: number;
  subject: SubjectKey1;
  resourceName: string;
  registeredDate: string;
  worksheets: ResourceWorksheet[];
  columnLinks: ResourceColumnLink[];
}

export type GetResourcesResponse = ResourceItem[];

export interface CreateResourceRequest {
  menteeId: number;
  subject: SubjectKey1;
  resourceName: string;
  fileId?: number;
  columnLink?: string;
}

export interface CreateResourceResponse {
  resourceId: number;
  subject: SubjectKey;
  resourceName: string;
  registeredDate: string;
  worksheets: ResourceWorksheet[];
  columnLinks: ResourceColumnLink[];
}

export interface UpdateResourceRequest {
  subject: SubjectKey1;
  resourceName: string;
  fileId?: number;
  columnLink?: string;
}

export type UpdateResourceResponse = ResourceItem;

/**
 * 자료 목록 조회
 */
export const getResources = async (
  menteeId: number,
): Promise<GetResourcesResponse> => {
  const { data } = await axiosInstance.get<GetResourcesResponse>("/resources", {
    params: { menteeId },
  });
  return data;
};

/**
 * 자료 등록
 */
export const createResource = async (
  payload: CreateResourceRequest,
): Promise<CreateResourceResponse> => {
  const { data } = await axiosInstance.post<CreateResourceResponse>(
    "/resources",
    payload,
  );
  return data;
};

/**
 * 자료 상세 조회
 */
export const getResourceDetail = async (
  resourceId: number,
): Promise<ResourceItem> => {
  const { data } = await axiosInstance.get<ResourceItem>(
    `/resources/${resourceId}`,
    {
      params: { resourceId },
    },
  );
  return data;
};

/**
 * 자료 수정
 */
export const updateResource = async (
  resourceId: number,
  payload: UpdateResourceRequest,
): Promise<UpdateResourceResponse> => {
  const { data } = await axiosInstance.put<UpdateResourceResponse>(
    `/resources/${resourceId}`,
    payload,
  );
  return data;
};

/**
 * 자료 삭제
 */
export const deleteResource = async (resourceId: number): Promise<void> => {
  await axiosInstance.delete(`/resources/${resourceId}`);
};
