import { RoleModel } from "../model/role.model";
import { IRole } from "../type/role.type";

export const getAllRolesFromDb = async (): Promise<IRole[]> => {
  return await RoleModel.find().lean().exec();
};
