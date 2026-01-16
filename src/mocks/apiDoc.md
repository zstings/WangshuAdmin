### ip黑名单接口

- `/user/addIpBlack` 添加、编辑ip黑名单 POST
  - 请求体参数：
    - ip: string, ip地址
    - remark: string, 备注
    - status: number, 状态（1：启用，0：禁用，编辑时必填）
    - id: string, ip黑名单id（编辑时必填）
- `/user/deleteIpBlack` 删除ip黑名单 POST
  - 请求体参数：
    - id: string, ip黑名单id
- `/user/getIpBlackList` 获取ip黑名单列表 GET
  - 请求体参数：
    - page: number, 页码
    - pageSize: number, 每页数量
    - ip: string, ip地址（可选）
    - status: number, 状态（1：启用，0：禁用，可选）

### 企业名称接口

- `/user/updateCompanyName` 修改企业名称 POST
  - 请求体参数：
    - id: string, 企业id
    - name: string, 企业名称
    - remark: string, 备注（可选）
- `/user/getCompanyList` 获取企业名称列表 GET
  - 请求体参数：
    - page: number, 页码
    - pageSize: number, 每页数量
    - name: string, 企业名称（可选）
- `/user/deleteCompany` 删除企业 POST
  - 请求体参数：
    - id: string, 企业id
- `/user/addCompany` 添加、编辑企业 POST
  - 请求体参数：
    - id: string, 企业id（编辑时必填）
    - name: string, 企业名称
    - remark: string, 备注（可选）
