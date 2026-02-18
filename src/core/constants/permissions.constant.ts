import { PermissionPointEnumType } from "./permission-enum-type.constant";

export class PermissionsConstant extends PermissionPointEnumType<PermissionsConstant> {
  public static readonly LOGIN = new PermissionsConstant('/auth/login', 'POST', []);
  public static readonly IDENTITY_ACCESS_ROLES_SELECT_MENU = new PermissionsConstant('/identity-access/roles-select-menu', 'POST', []);
    public static readonly IDENTITY_ACCESS_USERS_DELETE = new PermissionsConstant('/identity-access/users/:id', 'DELETE', ['iam:users:delete']);


  private constructor(public readonly endpoint: string, public readonly method: string, public readonly permissions: Array<string>) {
    super(endpoint);
    this.method = method;
    this.permissions = permissions;
  }

  public static getValues(): PermissionsConstant[] {
    return [
      this.LOGIN,
      this.IDENTITY_ACCESS_ROLES_SELECT_MENU,
      this.IDENTITY_ACCESS_USERS_DELETE,
    ];
  }

  public static getByEndpoint(endpoint: string) {
    let results = this.getValues().filter(item => item.endpoint === endpoint);
    if (results && results.length > 0) {
      return results[0];
    }
    return null;
  }

  public static getPermissionsByEndpointAndMethod(endpoint: string, method: string) {
    for (const item of this.getValues()) {
      if (this.checkEndpoint(item.endpoint, endpoint) && item.method === method) {
        return item.permissions;
      }
    }
    return null;
  }

  private static checkEndpoint(patternUrl: string, originalUrl: string) {
    const pattern = patternUrl.replace(/:\w+/g, '[^/]+');
    const regex = new RegExp(`^${pattern}$`);

    if (regex.test(originalUrl)) {
      return true;
    } else {
      return false
    }
  }

}

