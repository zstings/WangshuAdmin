import Dexie, { type Table } from 'dexie';

export interface User {
  id?: number;
  username: string;
  password?: string;
  avatar: string;
  gender: string;
  token: string;
}

export interface Tokens {
  id?: string;
  token: string;
}

export interface IIpBlack {
  id?: string;
  ip: string;
  status: number;
  remark: string;
  createAt: number;
  updateAt?: number;
}

export interface ICompany {
  id?: number;
  name: string;
  createAt: number;
  updateAt?: number;
  remark: string;
}

export interface IContract {
  id?: number;
  name: string;
  type: number; // 1 项目合同 2 服务合同
  status: number; // 0 待审核 1 审核中 2 审核失败 5 待履行 6 履行中 7 已完成
  price: string;
  startTime: string;
  endTime: string;
  companyId: number;
  createAt: number;
  updateAt?: number;
}

export class MyDatabase extends Dexie {
  // 在这里声明所有的表
  users!: Table<User>;
  tokens!: Table<Tokens>;
  ipBlack!: Table<IIpBlack>;
  companies!: Table<ICompany>;
  contracts!: Table<IContract>;

  constructor() {
    super('MockDatabase');
    // orderNo 是唯一的，userId 建立索引方便查询某个用户下的订单
    this.version(1).stores({
      users: '++id, username, password, token',
      orders: '++id, &orderNo, userId, status',
      tokens: '++id, token',
      ipBlack: '++id, ip, status, remark',
      companies: '++id, name',
      contracts: '++id, name, type, status, startTime, endTime, companyId',
    });
  }
}

export const db = new MyDatabase();

// 初始化一些测试数据
db.on('populate', () => {
  db.users.bulkAdd([
    { username: 'admin', password: 'admin', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1', gender: '男', token: '' },
    { username: 'test', password: '123456', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2', gender: '女', token: '' },
  ]);
  db.ipBlack.bulkAdd([
    {
      ip: '127.0.0.1',
      status: 1,
      remark: '测试IP',
      createAt: Date.now(),
    },
    {
      ip: '127.0.0.2',
      status: 1,
      remark: '测试IP',
      createAt: Date.now(),
    },
    {
      ip: '127.0.0.3',
      status: 1,
      remark: '测试IP',
      createAt: Date.now(),
    },
    {
      ip: '127.0.0.4',
      status: 0,
      remark: '测试IP',
      createAt: Date.now(),
    },
    {
      ip: '127.0.0.5',
      status: 0,
      remark: '测试IP',
      createAt: Date.now(),
    },
  ]);
  db.companies.bulkAdd([
    { name: '大明集团', createAt: Date.now(), remark: '大明集团', id: 10001 },
    { name: '大秦集团', createAt: Date.now(), remark: '大秦集团', id: 10002 },
  ]);
  db.contracts.bulkAdd([
    { name: '修建长城', type: 1, status: 1, price: '1000000', startTime: '2023-01-01', endTime: '2023-12-31', companyId: 10002, createAt: Date.now() },
    { name: '书同文', type: 1, status: 1, price: '2000000', startTime: '2023-01-01', endTime: '2023-12-31', companyId: 10002, createAt: Date.now() },
    { name: '下西洋', type: 1, status: 1, price: '2000000', startTime: '2023-01-01', endTime: '2023-12-31', companyId: 10001, createAt: Date.now() },
    { name: '抗倭', type: 1, status: 1, price: '2000000', startTime: '2023-01-01', endTime: '2023-12-31', companyId: 10001, createAt: Date.now() },
  ]);
});
