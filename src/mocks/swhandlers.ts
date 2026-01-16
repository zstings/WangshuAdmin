import { httpRequest } from 'mocksw';
import { db } from './db';

// 登录接口
httpRequest.post('/user/login', async (req, res) => {
  // 获取请求体中的用户名和密码
  const { username, password } = req.body;
  // 从数据库中查询用户
  const user = await db.users.where({ username: username, password: password }).first();
  // 如果用户不存在 则返回错误响应
  if (!user) return res.json({ code: 500, msg: '账号或密码不匹配' });
  // 生成 token 并存储到数据库
  const createToken = 'tk_' + Date.now();
  if (user) {
    user.token = createToken;
    await db.users.update(user.id, user);
    await db.tokens.add({ token: createToken });
    // 登录成功后返回 token
    return res.json({ code: 200, data: { token: createToken } });
  }
});
// 获取用户信息接口
httpRequest.get('/user/getInfo', async (req, res) => {
  const token = await checkToken(req, res);
  const user = await db.users.where({ token: token }).first();
  if (!user) return res.json({ code: 500, msg: '用户不存在' });
  // 模拟延迟 500ms
  return res.delay(500).json({ code: 200, data: Object.assign({}, user, { token: undefined }) });
});
// 登出接口
httpRequest.post('/user/logout', async (req, res) => {
  await checkToken(req, res);
  const token = getHeadersToken(req);
  await db.tokens.where({ token }).delete();
  const user = (await db.users.where({ token }).first())!;
  user.token = '';
  await db.users.update(user.id, user);
  return res.json({ code: 200, msg: '登出成功' });
});
// 获取ip黑名单
httpRequest.get('/user/getIpBlackList', async (req, res) => {
  await checkToken(req, res);
  const { ip = '', status = '', page = 1, pageSize = 10 } = req.query;
  // 1. 初始化查询对象
  let query;
  if (status !== '' || ip !== '') {
    query = db.ipBlack.where({ ...(status !== '' ? { status: Number(status) } : {}), ...(ip !== '' ? { ip: ip } : {}) });
  } else {
    query = db.ipBlack.toCollection();
  }
  const reversedQuery = query.reverse();
  const [total, list] = await Promise.all([
    reversedQuery.count(),
    reversedQuery
      .clone() // 注意：必须 clone 或者是重新定义查询，因为 Collection 在执行后可能被消费
      .offset((page - 1) * pageSize)
      .limit(pageSize)
      .toArray(),
  ]);
  return res.json({ code: 200, data: { list: list, total: total }, msg: '获取成功' });
});
// 添加ip黑名单
httpRequest.post('/user/addIpBlack', async (req, res) => {
  await checkToken(req, res);
  const { ip, remark = '', status, id } = req.body;
  if (!ip) return res.json({ code: 500, msg: 'ip 不能为空' });
  if (id) {
    const ipBlack = await db.ipBlack.where({ id }).first();
    ipBlack!.ip = ip;
    ipBlack!.status = Number(status);
    ipBlack!.remark = remark;
    ipBlack!.updateAt = Date.now();
    await db.ipBlack.update(ipBlack!.id, ipBlack!);
    return res.json({ code: 200, msg: '更新成功' });
  }
  const ipBlack = await db.ipBlack.where({ ip }).first();
  if (ipBlack) return res.json({ code: 500, msg: 'ip 已存在, 无需重复添加' });
  await db.ipBlack.add({ ip, status: Number(status), remark, createAt: Date.now() });
  return res.json({ code: 200, msg: '添加成功' });
});
// 删除ip黑名单
httpRequest.post('/user/deleteIpBlack', async (req, res) => {
  await checkToken(req, res);
  const { id } = req.body;
  if (!id) return res.json({ code: 500, msg: 'id 不能为空' });
  const ipBlack = await db.ipBlack.where({ id: id }).first();
  if (!ipBlack) return res.json({ code: 500, msg: 'ip 不存在' });
  await db.ipBlack.delete(ipBlack.id);
  return res.json({ code: 200, msg: '删除成功' });
});
// 获取企业列表
httpRequest.get('/user/getCompanyList', async (req, res) => {
  await checkToken(req, res);
  const { name = '', page = 1, pageSize = 10 } = req.query;
  // 1. 初始化查询对象
  let query;
  if (name) {
    query = db.companies.where({ name });
  } else {
    query = db.companies.toCollection();
  }
  const reversedQuery = query.reverse();
  const [total, list] = await Promise.all([
    reversedQuery.count(),
    reversedQuery
      .clone()
      .offset((page - 1) * pageSize)
      .limit(pageSize)
      .toArray(),
  ]);
  return res.json({ code: 200, data: { list: list, total: total }, msg: '获取成功' });
});
// 添加、编辑企业
httpRequest.post('/user/addCompany', async (req, res) => {
  await checkToken(req, res);
  const { name, remark = '', id } = req.body;
  if (!name) return res.json({ code: 500, msg: '企业名称不能为空' });
  if (id) {
    const company = await db.companies.where({ id }).first();
    company!.name = name;
    company!.remark = remark;
    company!.updateAt = Date.now();
    await db.companies.update(company!.id, company!);
    return res.json({ code: 200, msg: '更新成功' });
  }
  const company = await db.companies.where({ name }).first();
  if (company) return res.json({ code: 500, msg: '企业名称已存在, 无需重复添加' });
  await db.companies.add({ name, remark, createAt: Date.now() });
  return res.json({ code: 200, msg: '添加成功' });
});
// 删除企业
httpRequest.post('/user/deleteCompany', async (req, res) => {
  await checkToken(req, res);
  const { id } = req.body;
  if (!id) return res.json({ code: 500, msg: 'id 不能为空' });
  const company = await db.companies.where({ id }).first();
  if (!company) return res.json({ code: 500, msg: '企业不存在' });
  await db.companies.delete(company.id);
  return res.json({ code: 200, msg: '删除成功' });
});
// 修改企业名称
httpRequest.post('/user/updateCompanyName', async (req, res) => {
  await checkToken(req, res);
  const { id, name } = req.body;
  if (!id || !name) return res.json({ code: 500, msg: 'id 或 企业名称不能为空' });
  const company = await db.companies.where({ id }).first();
  if (!company) return res.json({ code: 500, msg: '企业不存在' });
  company.name = name;
  company.updateAt = Date.now();
  await db.companies.update(company.id, company);
  return res.json({ code: 200, msg: '更新成功' });
});
// 获取合同列表
httpRequest.get('/user/getContractList', async (req, res) => {
  await checkToken(req, res);
  const { page = 1, pageSize = 10, ...querys } = req.query;
  console.log(querys);
  const queryArr: Record<string, any> = Object.keys(querys).reduce((x: any, y: any) => {
    if (querys[y] || typeof querys[y] == 'number') {
      if (y == 'status' || y == 'type' || y == 'companyId') x[y] = Number(querys[y]);
      else if (y == 'startTime' || y == 'endTime') x[y] = new Date(querys[y]).getTime();
      else x[y] = querys[y];
    }
    return x;
  }, {});
  // 1. 初始化查询对象
  const query = Object.keys(queryArr).length == 0 ? db.contracts.toCollection() : db.contracts.where(queryArr);
  const reversedQuery = query.reverse();
  const [total, list] = await Promise.all([
    reversedQuery.count(),
    reversedQuery
      .clone()
      .offset((page - 1) * pageSize)
      .limit(pageSize)
      .toArray(),
  ]);
  return res.json({ code: 200, data: { list: list, total: total }, msg: '获取成功' });
});
// 新增合同
httpRequest.post('/user/addContract', async (req, res) => {
  await checkToken(req, res);
  const { name, type, price, companyId, id, status, startTime, endTime } = req.body;
  if (!name || !type || !price || !companyId || !startTime || !endTime) return res.json({ code: 500, msg: '参数错误' });
  if (id) {
    const contract = await db.contracts.where({ id }).first();
    contract!.name = name;
    contract!.type = type;
    contract!.price = price.toString();
    contract!.companyId = companyId;
    contract!.startTime = startTime;
    contract!.endTime = endTime;
    contract!.updateAt = Date.now();
    contract!.status = Number(status);
    await db.contracts.update(contract!.id, contract!);
    return res.json({ code: 200, msg: '更新成功' });
  } else {
    const contract = await db.contracts.where({ name }).first();
    if (contract) return res.json({ code: 500, msg: '合同已存在, 无需重复添加' });
    await db.contracts.add({
      name,
      type: Number(type),
      status: 0,
      price: price.toString(),
      companyId,
      startTime,
      endTime,
      createAt: Date.now(),
    });
    return res.json({ code: 200, msg: '添加成功' });
  }
});
// 删除合同
httpRequest.post('/user/deleteContract', async (req, res) => {
  await checkToken(req, res);
  const { id } = req.body;
  if (!id) return res.json({ code: 500, msg: 'id 不能为空' });
  const contract = await db.contracts.where({ id }).first();
  if (!contract) return res.json({ code: 500, msg: '合同不存在' });
  await db.contracts.delete(contract.id);
  return res.json({ code: 200, msg: '删除成功' });
});
// 修改合同状态
httpRequest.post('/user/updateContractStatus', async (req, res) => {
  await checkToken(req, res);
  const { id, status } = req.body;
  if (!id || status == null) return res.json({ code: 500, msg: '参数错误' });
  const contract = await db.contracts.where({ id }).first();
  if (!contract) return res.json({ code: 500, msg: '合同不存在' });
  contract.status = Number(status);
  contract.updateAt = Date.now();
  await db.contracts.update(contract.id, contract);
  return res.json({ code: 200, msg: '状态更新成功' });
});
// 修改合同名称
httpRequest.post('/user/updateContractName', async (req, res) => {
  await checkToken(req, res);
  const { id, name } = req.body;
  if (!id || !name) return res.json({ code: 500, msg: '参数错误' });
  const contract = await db.contracts.where({ id }).first();
  if (!contract) return res.json({ code: 500, msg: '合同不存在' });
  contract.name = name;
  contract.updateAt = Date.now();
  await db.contracts.update(contract.id, contract);
  return res.json({ code: 200, msg: '名称更新成功' });
});

function getHeadersToken(req: any) {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  return authHeader?.replace('Bearer ', '');
}

async function checkToken(req: any, res: any) {
  const token = getHeadersToken(req);
  if (!token) return res.json({ code: 500, msg: '未登录' });
  const tokenInfo = await db.tokens.where({ token: token }).first();
  if (!tokenInfo) return res.json({ code: 1001, msg: 'token已过期' });
  return token;
}

export default httpRequest;
