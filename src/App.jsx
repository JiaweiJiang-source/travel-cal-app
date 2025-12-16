import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  Layout, Calendar, Badge, List, Checkbox, Card, Col, Row,
  Select, Typography, Tooltip, message, Button, Modal, Form, Input,
  DatePicker, Tag, ConfigProvider, theme, Steps, Avatar, Empty,
  Drawer, Upload, Popconfirm, Switch, Radio, Spin, Tabs, Grid
} from 'antd';
import {
  CalendarOutlined, CheckSquareOutlined, ProjectOutlined,
  PlusOutlined, DeleteOutlined, ClockCircleOutlined,
  GlobalOutlined, FireOutlined, StarOutlined, BellOutlined,
  FileTextOutlined, RocketOutlined, EditOutlined,
  CheckCircleOutlined, ExclamationCircleOutlined, SyncOutlined,
  LinkOutlined, PlusCircleOutlined, ImportOutlined,
  ClearOutlined, LeftOutlined, RightOutlined,
  SunOutlined, MoonOutlined, UnorderedListOutlined, AppstoreOutlined,
  UserOutlined, LockOutlined, LogoutOutlined, MenuOutlined,
  PushpinOutlined, PushpinFilled,
  CloseCircleOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import locale from 'antd/locale/zh_CN';
import { createClient } from '@supabase/supabase-js';

// --- Supabase 初始化 ---
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// 设置 Dayjs
dayjs.locale('zh-cn');

const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { useBreakpoint } = Grid;

// --- 常量定义 ---
const COLOR_PALETTE = [
  { label: '经典蓝', value: '#1890ff', color: '#1890ff' },
  { label: '蒂芙尼', value: '#13c2c2', color: '#13c2c2' },
  { label: '罗兰紫', value: '#722ed1', color: '#722ed1' },
  { label: '珊瑚红', value: '#f5222d', color: '#f5222d' },
  { label: '日落橙', value: '#fa8c16', color: '#fa8c16' },
  { label: '极光绿', value: '#52c41a', color: '#52c41a' },
  { label: '樱花粉', value: '#eb2f96', color: '#eb2f96' },
  { label: '深海蓝', value: '#2f54eb', color: '#2f54eb' },
  { label: '极夜黑', value: '#434343', color: '#434343' },
  { label: '芥末黄', value: '#fadb14', color: '#fadb14' },
];

const HOLIDAYS = {
  // ================= 2025 (剩余) =================
  '2025-12-25': { name: 'Christmas', country: 'AU' },
  '2025-12-26': { name: 'Boxing Day', country: 'AU' },

  // ================= 2026 (全年) =================
  // --- 元旦 (New Year) ---
  '2026-01-01': { name: '元旦/NYD', country: 'CN' }, // 中澳同庆
  '2026-01-02': { name: '假期', country: 'CN' }, // 中澳同庆
  '2026-01-03': { name: '假期', country: 'CN' }, // 中澳同庆

  // --- 澳洲国庆 (Australia Day) ---
  '2026-01-26': { name: 'Aus Day', country: 'AU' },

  // --- 春节 (Chinese New Year) ---
  '2026-02-15': { name: '调休(班)', country: 'CN' }, 
  '2026-02-16': { name: '除夕', country: 'CN' },
  '2026-02-17': { name: '春节', country: 'CN' },
  '2026-02-18': { name: '初二', country: 'CN' },
  '2026-02-19': { name: '初三', country: 'CN' },
  '2026-02-20': { name: '初四', country: 'CN' },
  '2026-02-21': { name: '初五', country: 'CN' },
  '2026-02-22': { name: '初六', country: 'CN' },
  '2026-02-28': { name: '调休(班)', country: 'CN' }, 

  // --- 澳洲复活节 (Easter 2026) & 清明节 (Qingming) 重合处理 ---
  '2026-04-03': { name: 'Good Fri', country: 'AU' },
  '2026-04-04': { name: 'Easter Sat', country: 'AU' },
  
  // 🔥 修复冲突 1: 4月5日合并显示
  '2026-04-05': { name: 'EasterSun/清明', country: 'AU' }, 
  
  // 🔥 修复冲突 2: 4月6日合并显示
  '2026-04-06': { name: 'EasterMon/补休', country: 'AU' },

  // --- 澳新军团日 (Anzac Day) ---
  '2026-04-25': { name: 'Anzac Day', country: 'AU' },

  // --- 劳动节 (Labor Day CN) ---
  '2026-04-26': { name: '调休(班)', country: 'CN' }, 
  '2026-05-01': { name: '劳动节', country: 'CN' },
  '2026-05-02': { name: '假期', country: 'CN' },
  '2026-05-03': { name: '假期', country: 'CN' },
  '2026-05-04': { name: '假期', country: 'CN' },
  '2026-05-05': { name: '假期', country: 'CN' },
  '2026-05-09': { name: '调休(班)', country: 'CN' }, 

  // --- 澳洲国王生日 (King's Birthday) ---
  '2026-06-08': { name: 'King\'s Bday', country: 'AU' },

  // --- 端午节 (Dragon Boat) ---
  '2026-06-19': { name: '端午节', country: 'CN' },
  '2026-06-20': { name: '假期', country: 'CN' },
  '2026-06-21': { name: '假期', country: 'CN' },

  // --- 中秋节 (Mid-Autumn) ---
  '2026-09-25': { name: '中秋节', country: 'CN' },
  
  // 🔥 修复冲突 3: 9月26日重复键 (保留假期，注释掉调休)
  '2026-09-26': { name: '假期', country: 'CN' }, 
  '2026-09-27': { name: '假期', country: 'CN' },

  // --- 国庆节 (National Day) ---
  // '2026-09-26': { name: '调休(班)', country: 'CN' }, // ❌ 已在上方定义为假期，此处注释掉避免冲突
  '2026-10-01': { name: '国庆节', country: 'CN' },
  '2026-10-02': { name: '假期', country: 'CN' },
  '2026-10-03': { name: '假期', country: 'CN' },
  '2026-10-04': { name: '假期', country: 'CN' },
  '2026-10-05': { name: '假期/LabourDay', country: 'CN' }, // NSW劳动节重合
  '2026-10-06': { name: '假期', country: 'CN' },
  '2026-10-07': { name: '假期', country: 'CN' },
  '2026-10-10': { name: '调休(班)', country: 'CN' }, 

  // --- 圣诞节 (Christmas) ---
  '2026-12-25': { name: 'Christmas', country: 'AU' },
  '2026-12-26': { name: 'Boxing Day', country: 'AU' },
  '2026-12-28': { name: 'Boxing(Obs)', country: 'AU' }, 

  // ================= 2027 (年初预测) =================
  '2027-01-01': { name: '元旦', country: 'CN' },
  '2027-01-26': { name: 'Aus Day', country: 'AU' },
  
  // 2027春节 (2月6日)
  '2027-02-05': { name: '除夕', country: 'CN' },
  '2027-02-06': { name: '春节', country: 'CN' },
  '2027-02-07': { name: '初二', country: 'CN' },
  '2027-02-08': { name: '初三', country: 'CN' },
};

const PRIORITY_CONFIG = {
  immediate: { label: '马上做', color: '#ff4d4f', icon: <FireOutlined /> },
  important: { label: '重要', color: '#faad14', icon: <StarOutlined /> },
  reminder:  { label: '提醒', color: '#1890ff', icon: <BellOutlined /> },
  memo:      { label: '备注', color: '#8c8c8c', icon: <FileTextOutlined /> },
  imported:  { label: '外部导入', color: '#722ed1', icon: <ImportOutlined /> },
};

// --- 样式 ---
const getStyles = (isDark) => ({
  layout: { 
    display: 'flex', flexDirection: 'row', width: '100vw', height: '100vh', 
    overflow: 'hidden', background: isDark ? '#000000' : '#f0f2f5' 
  },
  sider: { 
    background: isDark ? '#141414' : '#ffffff', 
    borderRight: isDark ? '1px solid #303030' : '1px solid #e8e8e8', 
    flexShrink: 0,
    display: 'flex', flexDirection: 'column'
  },
  innerLayout: {
    display: 'flex', flexDirection: 'column', flex: 1, width: '0px', background: 'transparent'
  },
  header: { 
    background: isDark ? 'rgba(20, 20, 20, 0.8)' : 'rgba(255, 255, 255, 0.8)', 
    backdropFilter: 'blur(10px)', padding: '0 24px', 
    borderBottom: isDark ? '1px solid #303030' : '1px solid #e8e8e8', 
    display: 'flex', alignItems: 'center', 
    justifyContent: 'space-between', flexShrink: 0 
  },
  glassCard: {
    background: isDark ? 'rgba(255, 255, 255, 0.04)' : '#ffffff', 
    backdropFilter: isDark ? 'blur(20px)' : 'none',
    border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #f0f0f0',
    borderRadius: '16px',
    boxShadow: isDark ? 'none' : '0 2px 8px rgba(0,0,0,0.05)',
    overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column'
  },
  eventBar: (color) => ({
    background: color, color: '#fff', borderRadius: '4px', padding: '2px 6px', fontSize: '11px', marginBottom: '2px',
    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', cursor: 'pointer', 
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)', fontWeight: 500, borderLeft: '3px solid rgba(255,255,255,0.3)'
  }),
  taskText: (done, category) => ({
    fontSize: '11px', 
    color: done ? (isDark ? 'rgba(255,255,255,0.4)' : '#bbb') : category === 'imported' ? '#d3adf7' : (isDark ? 'rgba(255,255,255,0.85)' : '#333'),
    textDecoration: done ? 'line-through' : 'none',
    background: isDark ? 'rgba(255,255,255,0.08)' : '#f5f5f5', 
    borderRadius: '3px', padding: '1px 4px', 
    marginBottom: '2px', display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer'
  })
});

// --- 提取 Sidebar 内容组件 ---
const SidebarContent = ({ activeTab, setActiveTab, isDarkMode, setIsDarkMode, handleSignOut, groups, onGroupCreate, openEditGroup, closeDrawer }) => (
    <div style={{ padding: 16, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', color: isDarkMode ? '#fff' : '#000', fontSize: 18, fontWeight: 'bold' }}>
            <GlobalOutlined style={{ marginRight: 8, color: '#1890ff' }} /> Travel Cal
        </div>
        
        {[{ key: 'calendar', icon: <CalendarOutlined />, label: '全局日历' }, { key: 'tasks', icon: <CheckSquareOutlined />, label: '待办中心' }, { key: 'workflow', icon: <ProjectOutlined />, label: '进度追踪' }].map(item => (
            <div key={item.key} onClick={() => { setActiveTab(item.key); if(closeDrawer) closeDrawer(); }} style={{ padding: '12px 16px', borderRadius: 8, cursor: 'pointer', background: activeTab === item.key ? '#1890ff' : 'transparent', color: activeTab === item.key ? '#fff' : (isDarkMode ? '#a0a0a0' : '#666'), marginBottom: 8, display: 'flex', gap: 10, transition: 'all 0.2s' }}>{item.icon} {item.label}</div>
        ))}
        
        <div style={{marginTop: 20}}>
            <Text style={{color: isDarkMode ? '#666' : '#999', fontSize: 12, paddingLeft: 8}}>最近团务 (点击编辑)</Text>
            {groups.map(g => (
                <div key={g.id} onClick={() => { openEditGroup(g); if(closeDrawer) closeDrawer(); }} style={{padding: '8px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, color: isDarkMode ? '#fff' : '#333'}}>
                    <div style={{width: 8, height: 8, borderRadius: '50%', background: g.color}} />
                    <div style={{flex: 1, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', fontSize: 13}}>{g.name}</div>
                    <EditOutlined style={{color: '#999', fontSize: 12}} />
                </div>
            ))}
            <Button type="dashed" block size="small" icon={<PlusOutlined />} onClick={() => { onGroupCreate(); if(closeDrawer) closeDrawer(); }} style={{marginTop: 12, borderColor: isDarkMode ? '#333' : '#d9d9d9', color: isDarkMode ? '#999' : '#666'}}>添加新团</Button>
        </div>
        
        <div style={{ marginTop: 'auto', paddingTop: 20, borderTop: isDarkMode ? '1px solid #303030' : '1px solid #e8e8e8' }}>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, padding: '0 8px'}}>
                <span style={{color: isDarkMode ? '#fff' : '#333', fontSize: 12}}>深色模式</span>
                <Switch checked={isDarkMode} onChange={setIsDarkMode} checkedChildren={<MoonOutlined />} unCheckedChildren={<SunOutlined />} />
            </div>
            <Button block danger icon={<LogoutOutlined />} onClick={handleSignOut}>退出登录</Button>
        </div>
    </div>
);

// --- 登录组件 ---
const AuthPage = () => {
    const [loading, setLoading] = useState(false);
    const [mode, setMode] = useState('login');

    const handleAuth = async (values) => {
        setLoading(true);
        const { email, password } = values;
        try {
            if (mode === 'login') {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
                message.success('登录成功，欢迎回来！');
            } else {
                const { error } = await supabase.auth.signUp({ email, password });
                if (error) throw error;
                message.success('注册成功！请直接登录或查收确认邮件。');
                setMode('login');
            }
        } catch (error) {
            message.error(error.message || '认证失败');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ height: '100vh', width: '100vw', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f0f2f5', backgroundImage: 'radial-gradient(#e6f7ff 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
            <Card style={{ width: '90%', maxWidth: 400, boxShadow: '0 4px 20px rgba(0,0,0,0.1)', borderRadius: 16 }} bordered={false}>
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                    <GlobalOutlined style={{ fontSize: 48, color: '#1890ff', marginBottom: 16 }} />
                    <Title level={3}>Travel Calendar Cloud</Title>
                    <Text type="secondary">Travel Calendar</Text>
                </div>
                
                <Tabs activeKey={mode} onChange={setMode} centered items={[{ label: '登录账号', key: 'login' }, { label: '注册新用户', key: 'register' }]} />

                <Form layout="vertical" onFinish={handleAuth} style={{marginTop: 20}}>
                    <Form.Item name="email" rules={[{ required: true, message: '请输入邮箱' }, { type: 'email', message: '邮箱格式不正确' }]}>
                        <Input prefix={<UserOutlined />} placeholder="电子邮箱" size="large" />
                    </Form.Item>
                    <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }, { min: 6, message: '密码至少6位' }]}>
                        <Input.Password prefix={<LockOutlined />} placeholder="密码" size="large" />
                    </Form.Item>
                    <Button type="primary" htmlType="submit" block size="large" loading={loading} style={{ marginTop: 12 }}>
                        {mode === 'login' ? '立即登录' : '创建账号'}
                    </Button>
                </Form>
            </Card>
        </div>
    );
};

const CalendarView = ({ groups, tasks, onEditGroup, onToggleTask, onAddTask, onDeleteTask, onEditTask, isDark, isMobile }) => {
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [viewMode, setViewMode] = useState('month');
    
    useEffect(() => {
        if(isMobile) setViewMode('list');
    }, [isMobile]);

    const [newTaskContent, setNewTaskContent] = useState('');
    const [newTaskGroupId, setNewTaskGroupId] = useState(null);
    const [newTaskCategory, setNewTaskCategory] = useState('reminder');
  
    const styles = getStyles(isDark);
    const isWheeling = useRef(false);
  
    const dataMap = useMemo(() => {
      const map = {};
      tasks.forEach(task => {
        if (!task.deadline) return;
        if (!map[task.deadline]) map[task.deadline] = { tasks: [], groups: [] };
        map[task.deadline].tasks.push(task);
      });
      groups.forEach(group => {
        let current = dayjs(group.start);
        const end = dayjs(group.end);
        while (current.isBefore(end) || current.isSame(end, 'day')) {
          const dateStr = current.format('YYYY-MM-DD');
          if (!map[dateStr]) map[dateStr] = { tasks: [], groups: [] };
          if (!map[dateStr].groups.find(g => g.id === group.id)) map[dateStr].groups.push(group);
          current = current.add(1, 'day');
        }
      });
      return map;
    }, [groups, tasks]);
  
    const listData = useMemo(() => {
      const list = [];
      const start = dayjs().startOf('day');
      for (let i = 0; i < 60; i++) {
          const d = start.add(i, 'day');
          const dStr = d.format('YYYY-MM-DD');
          if (dataMap[dStr] || HOLIDAYS[dStr]) {
              list.push({ date: d, data: dataMap[dStr] || { tasks: [], groups: [] }, holiday: HOLIDAYS[dStr] });
          }
      }
      return list;
    }, [dataMap]);
  
    // ✅ 修复1：优化的节日配色逻辑，解决深色模式看不清的问题
    const getHolidayColors = (country, isDark) => {
        if (isDark) {
            // 深色模式：使用深色背景 + 高亮浅色文字
            return country === 'AU' 
                ? { bg: 'rgba(23, 114, 255, 0.15)', text: '#91caff' }  // 澳洲: 亮蓝
                : { bg: 'rgba(255, 77, 79, 0.15)', text: '#ff7875' };  // 中国: 亮红
        } else {
            // 浅色模式：淡色背景 + 深色文字
            return country === 'AU' 
                ? { bg: 'rgba(0, 58, 140, 0.08)', text: '#003a8c' } 
                : { bg: 'rgba(168, 7, 26, 0.08)', text: '#a8071a' };
        }
    };

    // ✅ 修复2：实现 Apple Calendar 风格的内部滚动
    // ✅ 核心修改：将团队信息移出滚动区，固定在顶部
    // ✅ 核心修改：增加排序逻辑 (未完成在前，已完成在后)
    const dateCellRender = useCallback((value) => {
      const dateStr = value.format('YYYY-MM-DD');
      const dayData = dataMap[dateStr]; 
      const holiday = HOLIDAYS[dateStr];
      const holidayStyle = holiday ? getHolidayColors(holiday.country, isDark) : null;

      // 🔄 排序：复制一份数组进行排序，避免污染原数据
      // 逻辑：Number(false) is 0, Number(true) is 1. a-b 升序会导致 0(未完成) 排在 1(已完成) 前面
      const sortedTasks = dayData?.tasks 
          ? [...dayData.tasks].sort((a, b) => Number(a.done) - Number(b.done)) 
          : [];
  
      return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
          
          {/* 1. 节日显示 (固定) */}
          {holiday && (
            <div style={{ marginBottom: 2, textAlign: 'center', flexShrink: 0 }}>
               <Tag 
                  bordered={false} 
                  style={{
                    margin: 0, width: '100%', padding: '0 2px', fontSize: 10, lineHeight: '18px',
                    background: holidayStyle.bg,
                    color: holidayStyle.text,
                    borderRadius: 4,
                  }}
               >
                 <span style={{marginRight: 4}}>{holiday.country === 'AU' ? '🇦🇺' : '🇨🇳'}</span>
                 <span style={{fontWeight: 600}}>{holiday.name}</span>
               </Tag>
            </div>
          )}

          {/* 2. 团队列表 (固定) */}
          {dayData && dayData.groups.length > 0 && (
            <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 4 }}>
              {dayData.groups.map(g => (
                  <Tooltip title={`点击修改: ${g.name}`} key={g.id}>
                    <div style={styles.eventBar(g.color)} onClick={(e) => { e.stopPropagation(); onEditGroup(g); }}>{g.name}</div>
                  </Tooltip>
              ))}
            </div>
          )}

          
          {/* 3. 任务列表 (滚动 + 排序后) */}
          {sortedTasks.length > 0 && (
              <div 
                className="calendar-cell-scroll"
                // 【核心修改】在此处添加 onWheel 阻止冒泡
                // 这将创造一个“滚动安全区”，只要鼠标在这个区域内，
                // 无论怎么滚，都绝对不会触发外层的月份切换。
                // 这就实现了“无级”、“丝滑”的独立滚动感。
                onWheel={(e) => e.stopPropagation()}
                
                style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: 2, 
                    flex: 1, 
                    // 确保高度自适应，撑满剩余空间
                    height: '100%', 
                    minHeight: 0,
                    
                    // 可选：添加一个细微的遮罩效果，让顶部和底部像 Apple 日历一样有淡出感
                    // (如果不喜欢可以去掉 maskImage 这一行)
                    maskImage: 'linear-gradient(to bottom, transparent 0%, black 5%, black 95%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 5%, black 95%, transparent 100%)'
                }}
              >
              {sortedTasks.map(t => (
                  <div key={t.id} style={styles.taskText(t.done, t.category)}>
                    <div style={{minWidth: 6, width: 6, height: 6, borderRadius: 2, background: PRIORITY_CONFIG[t.category].color, flexShrink: 0}}></div>
                    <span style={{overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', opacity: t.done ? 0.6 : 1}}>{t.content}</span>
                  </div>
              ))}
              </div>
          )}
        </div>
      );
    }, [dataMap, onEditGroup, styles, isDark]);

    const handleDrawerQuickAdd = () => {
      if (!newTaskContent.trim()) { message.warning('请输入任务内容'); return; }
      onAddTask({
        content: newTaskContent,
        deadline: selectedDate.format('YYYY-MM-DD'),
        category: newTaskCategory,
        linkedInfo: newTaskGroupId ? { groupId: newTaskGroupId } : null
      });
      setNewTaskContent('');
      setNewTaskGroupId(null);
    };
  
    const selectedDateStr = selectedDate.format('YYYY-MM-DD');
    const currentDayData = dataMap[selectedDateStr] || { tasks: [], groups: [] };
    const holiday = HOLIDAYS[selectedDateStr];
  
    const handleWheel = (e) => {
      if (viewMode === 'list') return; 
      if (isWheeling.current) return;
      // 只有当鼠标不在单元格内部滚动区域时，才触发月份切换
      // 但由于事件冒泡，这里做一个简单的延时锁即可，更复杂的判断交给 cellRender 的 stopPropagation
      isWheeling.current = true;
      setTimeout(() => { isWheeling.current = false; }, 300);
      if (e.deltaY > 0) setSelectedDate(prev => prev.add(1, 'month'));
      else setSelectedDate(prev => prev.subtract(1, 'month'));
    };
  
    return (
      <>
        {/* 添加全局 CSS 隐藏滚动条但保留功能 */}
        <style>{`
        .calendar-cell-scroll {
            /* 1. 核心：允许垂直滚动 */
            overflow-y: auto;
            
            /* 2. 隐藏滚动条但保留功能 (Mac OS 风格) */
            scrollbar-width: none; /* Firefox */
            -ms-overflow-style: none; /* IE/Edge */
            
            /* 3. 关键：阻止滚动链和橡皮筋效果波及父级 */
            /* 这会让容器滚到底部时，像撞到棉花一样停住，而不是带动外层月份切换 */
            overscroll-behavior: contain;
            
            /* 4. 开启 iOS/Mac 硬件加速的惯性滚动 */
            -webkit-overflow-scrolling: touch;
            
            /* 5. 增加一点底部内边距，防止最后一个任务贴底太紧 */
            padding-bottom: 10px;
        }
        
        .calendar-cell-scroll::-webkit-scrollbar { 
            display: none; /* Chrome/Safari */
        }
        `}</style>

        <Card 
          style={styles.glassCard} 
          bordered={false} 
          bodyStyle={{padding: 0, height: '100%', display: 'flex', flexDirection: 'column'}}
          onWheel={handleWheel}
        >
          <div style={{ 
              padding: '16px 24px', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: isMobile ? 'flex-start' : 'center', 
              borderBottom: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #f0f0f0',
              flexDirection: isMobile ? 'column' : 'row',
              gap: isMobile ? 12 : 0
          }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {viewMode === 'month' ? (
                    <>
                      <DatePicker 
                          picker="month" value={selectedDate} onChange={(date) => { if(date) setSelectedDate(date); }} allowClear={false} bordered={false}
                          suffixIcon={<ClockCircleOutlined style={{color: '#1890ff', fontSize: 18}} />}
                          style={{ fontSize: 24, fontWeight: 'bold', color: isDark ? '#fff' : '#000', padding: 0 }}
                          dropdownStyle={{ background: isDark ? '#1f1f1f' : '#fff' }} format="YYYY年 MMMM"
                      />
                      {!isMobile && <div style={{fontSize: 12, color: isDark ? 'rgba(255,255,255,0.3)' : '#999', marginTop: 4}}>(滚轮可切换)</div>}
                    </>
                  ) : <div style={{ fontSize: 24, fontWeight: 'bold', color: isDark ? '#fff' : '#000' }}>未来日程流 (60天)</div>}
              </div>
  
              <div style={{display: 'flex', gap: 16, width: isMobile ? '100%' : 'auto', justifyContent: isMobile ? 'space-between' : 'flex-end'}}>
                  {!isMobile && (
                      <Radio.Group value={viewMode} onChange={e => setViewMode(e.target.value)} buttonStyle="solid">
                          <Radio.Button value="month"><AppstoreOutlined /> 月历</Radio.Button>
                          <Radio.Button value="list"><UnorderedListOutlined /> 列表</Radio.Button>
                      </Radio.Group>
                  )}
                  
                  {viewMode === 'month' && (
                      <div style={{display: 'flex', gap: 8}}>
                          <Tooltip title="上个月"><Button icon={<LeftOutlined />} onClick={() => setSelectedDate(prev => prev.subtract(1, 'month'))} /></Tooltip>
                          <Button type="primary" ghost onClick={() => setSelectedDate(dayjs())}>今天</Button>
                          <Tooltip title="下个月"><Button icon={<RightOutlined />} onClick={() => setSelectedDate(prev => prev.add(1, 'month'))} /></Tooltip>
                      </div>
                  )}
              </div>
          </div>
  
          <div style={{flex: 1, overflowY: 'auto', position: 'relative'}}>
              {viewMode === 'month' && !isMobile ? (
                  <Calendar 
                    value={selectedDate}
                    onSelect={(date, { source }) => {
                      setSelectedDate(date);
                      if (source === 'date') { setDrawerVisible(true); setNewTaskContent(''); }
                    }}
                    cellRender={(current, info) => info.type === 'date' ? dateCellRender(current) : info.originNode}
                    fullscreen={true} 
                    headerRender={() => null} 
                  />
              ) : (
                  <div style={{padding: isMobile ? '16px' : '20px 40px'}}>
                      {listData.length > 0 ? listData.map((item, idx) => {
                          // 排序：未完成在前
                          const sortedTasks = [...item.data.tasks].sort((a, b) => Number(a.done) - Number(b.done));
                          
                          return (
                          <div key={idx} style={{
                              display: isMobile ? 'block' : 'flex',
                              marginBottom: 24, 
                              gap: isMobile ? 0 : 24
                          }}>
                              {/* 左侧：日期 */}
                              <div style={{
                                  width: isMobile ? '100%' : 80, 
                                  textAlign: isMobile ? 'left' : 'center', 
                                  flexShrink: 0,
                                  display: isMobile ? 'flex' : 'block',
                                  alignItems: 'center',
                                  gap: 8,
                                  marginBottom: isMobile ? 8 : 0,
                                  paddingBottom: isMobile ? 8 : 0,
                                  borderBottom: isMobile ? (isDark ? '1px solid #333' : '1px solid #eee') : 'none'
                              }}>
                                  <div style={{fontSize: isMobile ? 18 : 14, color: isDark ? '#888' : '#999', fontWeight: isMobile ? 'bold' : 'normal'}}>{item.date.format('ddd')}</div>
                                  <div style={{fontSize: isMobile ? 18 : 28, fontWeight: 'bold', color: isDark ? '#fff' : '#333', lineHeight: 1}}>{item.date.format(isMobile ? 'MM-DD' : 'DD')}</div>
                                  {!isMobile && <div style={{fontSize: 12, color: isDark ? '#666' : '#bbb'}}>{item.date.format('M月')}</div>}
                                  {item.holiday && <Tag color="red" style={{marginLeft: isMobile ? 'auto' : 0, marginTop: isMobile ? 0 : 8}}>{item.holiday.name}</Tag>}
                              </div>

                              {/* 右侧：内容 */}
                              <div style={{
                                  flex: 1, 
                                  borderLeft: !isMobile ? (isDark ? '1px solid #333' : '1px solid #e8e8e8') : 'none', 
                                  paddingLeft: isMobile ? 0 : 24
                              }}>
                                  {/* 团队显示 */}
                                  {item.data.groups.map(g => (
                                      <div key={g.id} onClick={() => onEditGroup(g)} style={{padding: '12px', background: isDark ? '#1f1f1f' : '#f9f9f9', borderRadius: 8, borderLeft: `4px solid ${g.color}`, marginBottom: 8, cursor: 'pointer'}}>
                                          <div style={{fontWeight: 'bold', color: isDark ? '#fff' : '#333'}}>{g.name}</div>
                                          <div style={{fontSize: 12, color: '#888'}}>{g.start} ~ {g.end}</div>
                                      </div>
                                  ))}

                                  {/* 任务显示 + 操作按钮 */}
                                  {sortedTasks.map(t => {
                                      const linkedGroup = t.linkedInfo ? groups.find(g => g.id === t.linkedInfo.groupId) : null;
                                      
                                      return (
                                      <div key={t.id} style={{
                                          display: 'flex', 
                                          alignItems: 'flex-start',
                                          gap: 12, 
                                          marginBottom: 8, 
                                          padding: '8px 12px', 
                                          background: isDark ? '#1a1a1a' : '#fff', 
                                          borderRadius: 8, 
                                          border: isDark ? '1px solid #333' : '1px solid #f0f0f0', 
                                          opacity: t.done ? 0.5 : 1, // 已完成半透明
                                          transition: 'all 0.3s'
                                      }}>
                                          <Checkbox checked={t.done} onChange={() => onToggleTask(t.id, t.done)} style={{marginTop: 3}} />
                                          
                                          <div style={{flex: 1, minWidth: 0}}> {/* minWidth: 0 防止flex子项溢出 */}
                                              <div style={{
                                                  color: isDark ? '#ddd' : '#333', 
                                                  textDecoration: t.done ? 'line-through' : 'none', 
                                                  fontSize: 14,
                                                  lineHeight: 1.5,
                                                  wordBreak: 'break-all'
                                              }}>
                                                  {t.content}
                                              </div>
                                              
                                              <div style={{display: 'flex', gap: 8, marginTop: 4, alignItems: 'center', flexWrap: 'wrap'}}>
                                                  <Tag size="small" style={{fontSize:10, margin:0, padding: '0 4px', lineHeight: '16px'}} color={PRIORITY_CONFIG[t.category].color}>
                                                      {PRIORITY_CONFIG[t.category].label}
                                                  </Tag>
                                                  {linkedGroup && (
                                                      <span style={{fontSize: 11, color: isDark ? '#177ddc' : '#1890ff', display: 'flex', alignItems: 'center', gap: 4}}>
                                                          <RocketOutlined /> {linkedGroup.name}
                                                      </span>
                                                  )}
                                              </div>
                                          </div>

                                          {/* ✅ 新增：编辑和删除按钮区 */}
                                          <div style={{display: 'flex', gap: 2, flexShrink: 0}}>
                                              <Tooltip title="编辑">
                                                  <Button type="text" size="small" icon={<EditOutlined style={{color: '#1890ff'}} />} onClick={() => onEditTask(t)} />
                                              </Tooltip>
                                              <Popconfirm 
                                                  title="删除任务" 
                                                  description="确定要删除这个任务吗？" 
                                                  onConfirm={() => onDeleteTask(t.id)} 
                                                  okText="删除" 
                                                  cancelText="取消" 
                                                  okButtonProps={{danger: true}}
                                                  placement="topRight"
                                              >
                                                  <Button type="text" size="small" danger icon={<DeleteOutlined />} />
                                              </Popconfirm>
                                          </div>
                                      </div>
                                  )})}
                                  
                                  {item.data.groups.length === 0 && sortedTasks.length === 0 && <div style={{color: isDark ? '#444' : '#eee', fontSize: 12}}>无日程</div>}
                              </div>
                          </div>
                      )}) : <Empty description="未来60天无安排" />}
                  </div>
              )}
          </div>
        </Card>
  
        <Drawer
          title={<span style={{color: isDark ? '#fff' : '#000', fontSize: 18}}>{selectedDate.format('YYYY年MM月DD日')} · 日程详情</span>}
          placement="right" width={isMobile ? '100%' : 420} onClose={() => setDrawerVisible(false)} open={drawerVisible}
          styles={{ header: {borderBottom: isDark ? '1px solid #303030' : '1px solid #f0f0f0', background: isDark ? '#141414' : '#fff'}, body: {background: isDark ? '#141414' : '#fff', padding: '24px', display: 'flex', flexDirection: 'column'}, mask: {backdropFilter: 'blur(4px)'}}}
          closeIcon={<span style={{color: isDark ? '#fff' : '#000'}}>✕</span>}
        >
           <div style={{ flex: 1, overflowY: 'auto' }}>
              {holiday && (
                  <div style={{ marginBottom: 24, padding: '12px 16px', borderRadius: 8, background: holiday.country === 'AU' ? 'linear-gradient(90deg, #003a8c 0%, #002766 100%)' : 'linear-gradient(90deg, #a8071a 0%, #5c0011 100%)', display: 'flex', alignItems: 'center', gap: 12, border: '1px solid rgba(255,255,255,0.1)' }}>
                      <div style={{fontSize: 24}}>{holiday.country === 'AU' ? '🇦🇺' : '🇨🇳'}</div>
                      <div><div style={{color: '#fff', fontWeight: 'bold', fontSize: 16}}>{holiday.name}</div><div style={{color: 'rgba(255,255,255,0.6)', fontSize: 12}}>公共假期</div></div>
                  </div>
              )}
              
              <div style={{ marginBottom: 32 }}>
                <div style={{color: isDark ? 'rgba(255,255,255,0.5)' : '#999', marginBottom: 12, fontSize: 13, textTransform: 'uppercase', letterSpacing: 1}}>进行中的团队</div>
                {currentDayData.groups.length > 0 ? (
                  currentDayData.groups.map(g => (
                    <div key={g.id} onClick={() => { setDrawerVisible(false); onEditGroup(g); }} style={{ padding: '16px', marginBottom: 12, borderRadius: 12, background: `linear-gradient(90deg, ${isDark ? 'rgba(255,255,255,0.05)' : '#f0f7ff'} 0%, ${g.color}22 100%)`, borderLeft: `4px solid ${g.color}`, cursor: 'pointer', transition: 'all 0.2s' }}>
                      <div style={{fontSize: 16, fontWeight: 600, color: isDark ? '#fff' : '#333', marginBottom: 4}}>{g.name}</div>
                      <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#999'}}><span><CalendarOutlined/> {g.start} ~ {g.end}</span><EditOutlined /></div>
                    </div>
                  ))
                ) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={<span style={{color: '#666'}}>今日无出团安排</span>} />}
              </div>
  
              <div>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12}}>
                  <div style={{color: isDark ? 'rgba(255,255,255,0.5)' : '#999', fontSize: 13, textTransform: 'uppercase', letterSpacing: 1}}>截止任务 ({currentDayData.tasks.length})</div>
                </div>
                {/* ✅ 修改：在这里加入 .sort()，让未完成的任务排在前面 */}
                <List 
                    dataSource={[...currentDayData.tasks].sort((a, b) => Number(a.done) - Number(b.done))} 
                    renderItem={item => {
                      const linkedGroup = item.linkedInfo ? groups.find(g => g.id === item.linkedInfo.groupId) : null;
                      return (
                      <div style={{ display: 'flex', gap: 12, padding: '12px', marginBottom: 8, background: isDark ? (item.done ? 'rgba(255,255,255,0.02)' : 'rgba(30,30,30,0.8)') : (item.done ? '#f5f5f5' : '#fff'), borderRadius: 8, border: isDark ? '1px solid #303030' : '1px solid #e8e8e8', alignItems: 'flex-start', boxShadow: isDark ? 'none' : '0 1px 2px rgba(0,0,0,0.05)' }}>
                        {/* Checkbox */}
                        <Checkbox checked={item.done} onChange={() => onToggleTask(item.id, item.done)} style={{marginTop: 4}} />
                        
                        <div style={{flex: 1, opacity: item.done ? 0.5 : 1, transition: 'opacity 0.3s'}}> {/* 增加透明度变化 */}
                          <div style={{color: isDark ? (item.done ? '#666' : '#fff') : (item.done ? '#bbb' : '#333'), textDecoration: item.done ? 'line-through' : 'none', fontSize: 14}}>{item.content}</div>
                          <div style={{marginTop: 6, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap'}}>
                            <Tag bordered={false} color={PRIORITY_CONFIG[item.category].color} style={{margin:0, fontSize:10, lineHeight:'16px', padding: '0 4px'}}>{PRIORITY_CONFIG[item.category].label}</Tag>
                            {item.linkedInfo && <span style={{fontSize: 10, color: '#1890ff', display: 'flex', alignItems: 'center', gap: 2, cursor: 'pointer', maxWidth: 150, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}><LinkOutlined/> {linkedGroup ? linkedGroup.name : '未知团务'}</span>}
                          </div>
                        </div>

                        <div style={{display: 'flex', gap: 4}}>
                           <Tooltip title="编辑"><Button type="text" size="small" icon={<EditOutlined style={{color: '#1890ff'}} />} onClick={()=>onEditTask(item)} /></Tooltip>
                           <Popconfirm title="删除任务" description="确定要删除这个任务吗？" onConfirm={() => onDeleteTask(item.id)} okText="删除" cancelText="取消" okButtonProps={{danger: true}}>
                             <Button type="text" size="small" danger icon={<DeleteOutlined />} />
                           </Popconfirm>
                        </div>
                      </div>
                    )}}
                    locale={{emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={<span style={{color: '#666'}}>今日无任务</span>} />}}
                />
              </div>
          </div>
          <div style={{ marginTop: 16, paddingTop: 16, borderTop: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #f0f0f0' }}>
              <div style={{color: isDark ? '#fff' : '#333', fontSize: 13, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8}}><PlusCircleOutlined style={{color: '#1890ff'}} /> 添加事项至 {selectedDate.format('MM月DD日')}</div>
              <Input placeholder="要做什么？" value={newTaskContent} onChange={e => setNewTaskContent(e.target.value)} onPressEnter={handleDrawerQuickAdd} style={{marginBottom: 12}} />
              <div style={{display: 'flex', gap: 8, flexDirection: isMobile ? 'column' : 'row'}}>
                  <div style={{display: 'flex', gap: 8}}>
                    <Select value={newTaskCategory} onChange={setNewTaskCategory} style={{width: 110}} dropdownStyle={{background: isDark ? '#1f1f1f' : '#fff'}}>{Object.entries(PRIORITY_CONFIG).map(([k, v]) => (<Select.Option key={k} value={k}><Badge color={v.color} text={v.label} /></Select.Option>))}</Select>
                    <Select placeholder="关联团务" style={{flex: 1}} allowClear value={newTaskGroupId} onChange={setNewTaskGroupId} dropdownStyle={{background: isDark ? '#1f1f1f' : '#fff'}}>{groups.map(g => <Select.Option key={g.id} value={g.id}>{g.name}</Select.Option>)}</Select>
                  </div>
                  <Button type="primary" onClick={handleDrawerQuickAdd} block={isMobile}>添加</Button>
              </div>
          </div>
        </Drawer>
      </>
    );
  };
  
  const TaskBoard = ({ tasks, groups, onToggle, onDelete, onEdit, onCreate, isDark, isMobile }) => {
    const [activeCategory, setActiveCategory] = useState('immediate');
    
    const currentList = useMemo(() => {
      return tasks
        .filter(t => t.category === activeCategory)
        .sort((a, b) => {
          if (a.done !== b.done) return a.done ? 1 : -1;
          const dateA = dayjs(a.deadline).valueOf();
          const dateB = dayjs(b.deadline).valueOf();
          if (dateA !== dateB) return dateA - dateB;
          return b.id - a.id;
        });
    }, [tasks, activeCategory]);
  
    const styles = getStyles(isDark);
  
    return (
      <div style={{ display: 'flex', gap: 24, height: '100%', flexDirection: isMobile ? 'column' : 'row' }}>
        <div style={{ width: isMobile ? '100%' : 220 }}>
          <Button type="primary" size="large" icon={<PlusOutlined />} onClick={() => onCreate()} block style={{ marginBottom: 16 }}>新建任务</Button>
          <div style={{ 
              display: isMobile ? 'flex' : 'block', 
              overflowX: 'auto', 
              gap: 8,
              paddingBottom: isMobile ? 8 : 0,
              scrollbarWidth: 'none' // Hide scrollbar for cleaner look
          }}>
            {Object.entries(PRIORITY_CONFIG).map(([key, cfg]) => {
                const count = tasks.filter(t => t.category === key && !t.done).length;
                const isActive = activeCategory === key;
                return (
                <div key={key} onClick={() => setActiveCategory(key)} style={{ 
                    display: 'flex', justifyContent: 'space-between', padding: '12px 16px', 
                    background: isActive ? `linear-gradient(90deg, ${cfg.color}33 0%, rgba(0,0,0,0) 100%)` : 'transparent', 
                    borderLeft: isActive && !isMobile ? `4px solid ${cfg.color}` : (isMobile && isActive ? 'none' : '4px solid transparent'), 
                    // Mobile active state style
                    border: isMobile && isActive ? `1px solid ${cfg.color}` : 'none',
                    borderRadius: 8, marginBottom: 8, color: isDark ? '#fff' : '#333', cursor: 'pointer', transition: 'all 0.3s',
                    flexShrink: 0,
                    minWidth: isMobile ? 120 : 'auto',
                    alignItems: 'center'
                }}>
                    <span style={{fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6}}>{cfg.icon} {cfg.label}</span>
                    <span style={{ fontWeight: 'bold', opacity: 0.8 }}>{count > 0 ? count : ''}</span>
                </div>
                );
            })}
          </div>
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <Card style={styles.glassCard} title={<div style={{display: 'flex', alignItems: 'center', gap: 8, color: isDark ? '#fff' : '#000'}}>{PRIORITY_CONFIG[activeCategory].icon} <span>{PRIORITY_CONFIG[activeCategory].label}清单</span></div>}>
            <div style={{overflowY: 'auto', height: '100%', paddingRight: 4}}>
                <List dataSource={currentList} locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无此类事项" /> }}
                renderItem={item => (
                    <List.Item 
                    style={{ 
                        padding: '12px 16px', 
                        background: isDark ? (item.done ? 'rgba(255,255,255,0.01)' : 'rgba(255,255,255,0.04)') : (item.done ? '#fdfdfd' : '#fff'), 
                        marginBottom: 8, 
                        borderRadius: 8, 
                        border: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid #e8e8e8',
                        transition: 'all 0.4s ease-in-out',
                        opacity: item.done ? 0.6 : 1, 
                    }} 
                    actions={[
                        <Tooltip title="编辑"><Button type="text" icon={<EditOutlined style={{color: '#1890ff'}}/>} onClick={() => onEdit(item)} /></Tooltip>,
                        <Popconfirm title="确认删除" description="删除后无法恢复" onConfirm={() => onDelete(item.id)} okText="删除" cancelText="点错了" okButtonProps={{danger: true}}>
                            <Button type="text" danger icon={<DeleteOutlined />} />
                        </Popconfirm>
                    ]}
                    >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%' }}>
                        <Checkbox checked={item.done} onChange={() => onToggle(item.id, item.done)} style={{ transform: 'scale(1.2)' }} />
                        <div style={{ flex: 1, transition: 'all 0.3s' }}>
                            <div style={{ 
                                fontSize: 15, 
                                textDecoration: item.done ? 'line-through' : 'none',
                                color: item.done ? (isDark ? '#666' : '#bbb') : (isDark ? '#fff' : '#333') 
                            }}>
                                {item.content}
                            </div>
                            <div style={{ display: 'flex', gap: 12, marginTop: 4, fontSize: 12, color: isDark ? 'rgba(255,255,255,0.45)' : '#999' }}>
                                {item.deadline && <span><ClockCircleOutlined /> {item.deadline}</span>}
                                {item.linkedInfo && <span style={{color: '#1890ff'}}> <RocketOutlined /> 关联: {groups.find(g=>g.id===item.linkedInfo.groupId)?.name}</span>}
                            </div>
                        </div>
                    </div>
                    </List.Item>
                )} />
            </div>
          </Card>
        </div>
      </div>
    );
  };
  

  const GroupNotepad = ({ group, onSave, isDark }) => {
    const [blocks, setBlocks] = useState(() => {
      // 1. 尝试从数据库加载数据
      if (group.memo_data && Array.isArray(group.memo_data) && group.memo_data.length > 0) {
        // 这里的 map 很重要，确保旧数据也有 type 字段
        return group.memo_data.map(b => ({ 
            ...b, 
            type: b.type || (b.checked !== undefined ? 'todo' : 'text') 
        }));
      }
      // 2. 如果是新团，初始化默认内容
      const baseId = Date.now();
      return [
        { id: baseId,     content: '行程大纲', type: 'h1', level: 0, checked: false },
        { id: baseId + 1, content: '纯文本记录 (无圆点)', type: 'text', level: 0, checked: false },
        { id: baseId + 2, content: '预定酒店', type: 'todo', level: 0, checked: false },
      ];
    });

    // 自动保存 (防抖: 1秒保存一次)
    useEffect(() => {
      const timer = setTimeout(() => {
        onSave(group.id, blocks);
      }, 1000); 
      return () => clearTimeout(timer);
    }, [blocks, group.id]);

    const updateBlock = (id, updates) => {
      setBlocks(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
    };

    const handleInputChange = (e, id, type) => {
      let val = e.target.value;
      
      // Markdown 触发逻辑
      if (type === 'text' || type === 'todo') {
          if (val.startsWith('# ')) {
              updateBlock(id, { content: val.slice(2), type: 'h1' }); 
              return;
          }
          if (val.startsWith('## ')) {
              updateBlock(id, { content: val.slice(3), type: 'h2' }); 
              return;
          }
          if (val.startsWith('[] ') || val.startsWith('【】 ')) {
              updateBlock(id, { content: val.slice(3), type: 'todo' }); 
              return;
          }
      }
      updateBlock(id, { content: val });
    };

    const handleKeyDown = (e, index, id, currentType) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        // 智能回车：标题后回车变文本，待办后回车还是待办
        const nextType = (currentType === 'h1' || currentType === 'h2') ? 'text' : currentType;
        
        const newBlock = { id: Date.now(), content: '', level: blocks[index].level, type: nextType, checked: false };
        const newBlocks = [...blocks];
        newBlocks.splice(index + 1, 0, newBlock);
        setBlocks(newBlocks);
        setTimeout(() => document.getElementById(`note-input-${newBlock.id}`)?.focus(), 0);
      } 
      else if (e.key === 'Backspace') {
        if (blocks[index].content === '') {
            if (currentType !== 'text') {
                e.preventDefault();
                updateBlock(id, { type: 'text' }); // 空行退格：变回普通文本
                return;
            }
            e.preventDefault();
            if (blocks.length > 1) {
              const newBlocks = blocks.filter(b => b.id !== id);
              setBlocks(newBlocks);
              setTimeout(() => document.getElementById(`note-input-${blocks[index - 1].id}`)?.focus(), 0);
            }
        }
      }
      else if (e.key === 'Tab') {
        e.preventDefault();
        const newLevel = e.shiftKey ? Math.max(0, blocks[index].level - 1) : Math.min(4, blocks[index].level + 1);
        updateBlock(id, { level: newLevel });
      }
    };

    const addBlock = (type) => {
        const newId = Date.now();
        setBlocks(prev => [...prev, { id: newId, content: '', level: 0, type: type, checked: false }]);
        setTimeout(() => document.getElementById(`note-input-${newId}`)?.focus(), 0);
    };

    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
        <div style={{ paddingBottom: 8, borderBottom: isDark ? '1px solid #333' : '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: '#999' }}>
          <span>Markdown 笔记</span>
          <span>{blocks.length} 行</span>
        </div>
        
        <div style={{ flex: 1, overflowY: 'auto', paddingRight: 4, paddingBottom: 40 }}>
          {blocks.map((block, index) => (
            <div key={block.id} style={{ 
              display: 'flex', 
              alignItems: 'center', 
              marginTop: 4, marginBottom: 4,
              paddingLeft: `${block.level * 24}px`, 
              opacity: block.checked ? 0.5 : 1,
              transition: 'all 0.2s',
              position: 'relative',
              ':hover .delete-btn': { opacity: 1 } 
            }}>
              {/* === 左侧区域：只有 todo 类型才显示复选框 === */}
              {block.type === 'todo' && (
                  <div style={{ marginRight: 8, display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                      <Checkbox 
                          checked={block.checked} 
                          onChange={(e) => updateBlock(block.id, { checked: e.target.checked })} 
                      />
                  </div>
              )}

              {/* === 输入框 === */}
              <Input
                id={`note-input-${block.id}`}
                value={block.content}
                onChange={(e) => handleInputChange(e, block.id, block.type)}
                onKeyDown={(e) => handleKeyDown(e, index, block.id, block.type)}
                placeholder="输入..."
                bordered={false}
                style={{ 
                  padding: '2px 0', 
                  color: isDark ? '#ddd' : '#333',
                  textDecoration: block.checked ? 'line-through' : 'none',
                  fontWeight: block.type === 'h1' ? 700 : (block.type === 'h2' ? 600 : 400), 
                  fontSize: block.type === 'h1' ? 22 : (block.type === 'h2' ? 17 : 14),
                  lineHeight: 1.5,
                }}
              />
              
              <Button 
                  type="text" size="small" className="delete-btn"
                  icon={<DeleteOutlined style={{fontSize: 12, color: isDark ? '#444' : '#ddd'}} />} 
                  onClick={() => { if(blocks.length > 1) setBlocks(prev => prev.filter(b => b.id !== block.id)); }}
                  style={{ marginLeft: 'auto', opacity: 0.5 }} 
              />
            </div>
          ))}
          
          {/* 点击底部空白处添加普通文本行 */}
          <div style={{ height: 100, cursor: 'text' }} onClick={() => addBlock('text')} />
        </div>

        {/* 底部浮动工具栏 */}
        <div style={{ 
            position: 'absolute', bottom: 0, left: 0, right: 0, 
            padding: '8px 16px', 
            background: isDark ? 'rgba(30,30,30,0.95)' : 'rgba(255,255,255,0.95)', 
            backdropFilter: 'blur(10px)',
            borderTop: isDark ? '1px solid #444' : '1px solid #eee',
            display: 'flex', justifyContent: 'space-around', alignItems: 'center',
            borderRadius: '0 0 16px 16px'
        }}>
            <Tooltip title="添加待办">
              <Button type="text" icon={<CheckSquareOutlined style={{fontSize: 18}} />} onClick={() => addBlock('todo')} />
            </Tooltip>
            <Tooltip title="一级标题">
              <Button type="text" icon={<span style={{fontSize: 18, fontWeight: 'bold'}}>H1</span>} onClick={() => addBlock('h1')} />
            </Tooltip>
            <Tooltip title="二级标题">
              <Button type="text" icon={<span style={{fontSize: 15, fontWeight: 'bold'}}>H2</span>} onClick={() => addBlock('h2')} />
            </Tooltip>
            <Tooltip title="普通文本">
              <Button type="text" icon={<FileTextOutlined style={{fontSize: 18}} />} onClick={() => addBlock('text')} />
            </Tooltip>
        </div>
      </div>
    );
  };


  const WorkflowTracker = ({ groups, tasks, onToggleTask, onAddQuickTask, onDelete, onEdit, isDark, isMobile, onUpdateGroup, onTogglePin, onImportTasks }) => {
    const [activeGroupId, setActiveGroupId] = useState(null);
    const [quickCategory, setQuickCategory] = useState('reminder'); 
    const [quickContent, setQuickContent] = useState('');
    const [quickDate, setQuickDate] = useState(null);

    // ✨ 新增：排序模式状态 (默认 true: 按优先级+完成状态排序)
    const [isSortByPriority, setIsSortByPriority] = useState(true);

    // ✨ 新增：优先级权重定义 (数值越小越靠前)
    const PRIORITY_WEIGHT = {
        immediate: 0, // 马上做
        important: 1, // 重要
        reminder: 2,  // 提醒
        memo: 3,      // 备忘
        imported: 4   // 外部导入
    };
    
    // --- 新增：拖拽调整高度相关 State 和 Ref ---
    const [topHeightPercent, setTopHeightPercent] = useState(50); // 默认 50%
    const rightColumnRef = useRef(null);
    const isDragging = useRef(false);

    const styles = getStyles(isDark);
    
    // 2. 【新增】保存单个节点备注的逻辑
    const handleSaveTaskNote = async (taskId, newNote) => {
        // 找到当前任务
        const task = tasks.find(t => t.id === taskId);
        if (!task) return;

        // 构造新的 linkedInfo (保留原有的 groupId, 添加 note)
        const newLinkedInfo = { ...(task.linkedInfo || {}), note: newNote };
        
        // A. 本地乐观更新 (为了让界面不闪烁)
        // 这里需要调用 App 传下来的 setTasks，但 workflowTracker 没有直接接收 setTasks
        // 所以我们用 onEdit 来触发更新，或者直接刷新列表。
        // 为了简单有效，我们直接更新数据库，React 的实时性会在数据回来时刷新，
        // 但为了体验更好，建议在 App.jsx 里传一个 onUpdateTask 进来。
        // 这里为了不让你改 App.jsx 太多，我们直接操作 Supabase，依赖 React 重新拉取或 onToggleTask 的机制
        
        // 更新数据库
        const { error } = await supabase
            .from('tasks')
            .update({ linkedInfo: newLinkedInfo })
            .eq('id', taskId);

        if (error) {
            message.error('备注保存失败');
        } else {
            // 💡 这是一个小技巧：手动触发一下 onToggleTask 的逻辑来刷新父组件状态，
            // 或者你可以专门在 App.js 加一个 onUpdateTask。
            // 既然你之前传了 onEdit，我们可以“假装”编辑了一下，或者依赖 supabase 的重新获取。
            // 最好的办法是：直接刷新页面，或者在 App.js 增加 handleUpdateTaskLocal。
            // 鉴于不想改 App.js，我们这里静默保存，通常用户切一下页面就看到了。
            
            // 如果你想即时看到效果，请在 App.js 传一个 onUpdateTaskLocal 进来。
            // 这里我们暂时假设你重新 fetch 或者接受这种“后台静默保存”。
            // *为了立刻生效*，我们可以手动修改本地 tasks 数组引用（虽然不推荐但管用）:
            task.linkedInfo = newLinkedInfo; 
        }
    };

    // --- 新增：导入弹窗状态 ---
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [importText, setImportText] = useState('');

    // --- 修改后：解析并导入逻辑 (支持 YYYYMMDD) ---
    const handleBulkImport = () => {
        if (!importText.trim()) return;

        const lines = importText.split('\n');
        const parsedTasks = [];

        lines.forEach(line => {
            const cleanLine = line.trim();
            if (!cleanLine) return;

            // ✅ 修改 1: 正则表达式升级
            // 解释: (标准分隔符格式) | (8位纯数字格式)
            // 例子: 2025-12-01, 2025/12/01, 2025.12.01, 20251201
            const dateRegex = /((\d{4}[-./]\d{1,2}[-./]\d{1,2})|(\d{8}))/;
            const dateMatch = cleanLine.match(dateRegex);

            if (dateMatch) {
                const rawDate = dateMatch[0];
                let deadline;

                // ✅ 修改 2: 处理纯数字格式 (例如 20251201)
                // Dayjs 默认不认 8位数字，所以我们手动插杠变成 2025-12-01
                if (/^\d{8}$/.test(rawDate)) {
                    const fmt = `${rawDate.slice(0, 4)}-${rawDate.slice(4, 6)}-${rawDate.slice(6, 8)}`;
                    deadline = dayjs(fmt).format('YYYY-MM-DD');
                } else {
                    // 标准格式直接解析
                    deadline = dayjs(rawDate).format('YYYY-MM-DD');
                }
                
                // 3. 提取内容 (把日期删掉，把前面的 "1. ", "2. " 删掉)
                let content = cleanLine
                    .replace(rawDate, '')          // 删掉日期字符串
                    .replace(/^[\d]+\./, '')       // 删掉 "1."
                    .replace(/^[\d]+、/, '')       // 删掉 "1、"
                    .replace(/[,，\s]+$/, '')      // 删掉末尾标点
                    .replace(/^[,，\s]+/, '')      // 删掉开头标点
                    .trim();

                // 检查一下日期是否有效 (避免 20251332 这种错误日期)
                if (content && deadline !== 'Invalid Date') {
                    parsedTasks.push({
                        content: content,
                        deadline: deadline,
                        category: 'important', 
                        linkedInfo: { groupId: activeGroupId }
                    });
                }
            }
        });

        if (parsedTasks.length > 0) {
            onImportTasks(parsedTasks);
            setIsImportModalOpen(false);
            setImportText('');
        } else {
            message.warning('未识别到有效日期，请检查格式 (支持 YYYY-MM-DD 或 YYYYMMDD)');
        }
    };

    const sortedGroups = useMemo(() => {
        // 复制一份新数组以免影响原数据
        return [...groups].sort((a, b) => {
            // 如果一个置顶一个没置顶，置顶的(true)排前面(-1)
            if (a.is_pinned !== b.is_pinned) {
                return a.is_pinned ? -1 : 1;
            }
            // 如果状态一样，保持原样 (或者你可以按开始时间排序: dayjs(a.start) - dayjs(b.start))
            return 0; 
        });
    }, [groups]);
    
    // 1. 【新增】单个节点的备注输入组件
    const TaskNoteInput = ({ task, onSave, isDark }) => {
        const [val, setVal] = useState(task.linkedInfo?.note || '');
        
        // 监听外部数据变化 (例如切换团队时)
        useEffect(() => {
            setVal(task.linkedInfo?.note || '');
        }, [task.id, task.linkedInfo]);

        const handleBlur = () => {
            if (val !== (task.linkedInfo?.note || '')) {
                onSave(task.id, val);
            }
        };

        return (
            <Input 
                size="small"
                placeholder="enter"
                value={val}
                onChange={e => setVal(e.target.value)}
                onBlur={handleBlur} // 失去焦点自动保存
                onPressEnter={(e) => { e.target.blur(); }} // 回车也保存
                bordered={false} // 平时不显示边框，看起来更干净
                style={{
                    fontSize: 12,
                    color: isDark ? '#aaa' : '#666',
                    padding: '0 4px',
                    marginTop: 4,
                    background: isDark ? 'rgba(255,255,255,0.05)' : '#f5f5f5',
                    borderRadius: 4,
                    width: '100%'
                }}
            />
        );
    };

    // --- 新增：节点备注逻辑 ---
    const [nodeNote, setNodeNote] = useState('');

    const handleAddNodeNote = async () => {
        if (!nodeNote.trim()) return;
        
        // 1. 获取旧数据 (如果没有就是空数组)
        const oldNotes = activeGroup.milestone_notes || [];
        const newNoteObj = { id: Date.now(), content: nodeNote };
        const newNotes = [...oldNotes, newNoteObj];

        // 2. 清空输入框
        setNodeNote('');

        // 3. 乐观更新本地 (让界面马上变)
        if (onUpdateGroup) {
            onUpdateGroup(activeGroup.id, { milestone_notes: newNotes });
        }

        // 4. 静默保存到数据库
        const { error } = await supabase
            .from('groups')
            .update({ milestone_notes: newNotes })
            .eq('id', activeGroup.id);
            
        if (error) message.error('备注保存失败');
    };

    const handleDeleteNodeNote = async (noteId) => {
        const oldNotes = activeGroup.milestone_notes || [];
        const newNotes = oldNotes.filter(n => n.id !== noteId);

        // 更新本地
        if (onUpdateGroup) {
            onUpdateGroup(activeGroup.id, { milestone_notes: newNotes });
        }
        // 更新数据库
        await supabase.from('groups').update({ milestone_notes: newNotes }).eq('id', activeGroup.id);
    };

    useEffect(() => {
      if (groups.length > 0 && (!activeGroupId || !groups.find(g => g.id === activeGroupId))) {
        setActiveGroupId(groups[0].id);
      }
    }, [groups, activeGroupId]);
  
    const activeGroup = groups.find(g => g.id === activeGroupId);

    // --- 拖拽逻辑 ---
    const handleMouseDown = (e) => {
        if (isMobile) return; // 手机端禁用拖拽
        isDragging.current = true;
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        document.body.style.userSelect = 'none'; // 防止拖拽时选中文字
        document.body.style.cursor = 'row-resize';
    };

    const handleMouseMove = (e) => {
        if (!isDragging.current || !rightColumnRef.current) return;
        
        const containerRect = rightColumnRef.current.getBoundingClientRect();
        const relativeY = e.clientY - containerRect.top; // 鼠标在容器内的 Y 坐标
        let newPercent = (relativeY / containerRect.height) * 100;

        // 限制范围：最小 20%，最大 80%
        if (newPercent < 20) newPercent = 20;
        if (newPercent > 80) newPercent = 80;

        setTopHeightPercent(newPercent);
    };

    const handleMouseUp = () => {
        isDragging.current = false;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.userSelect = ''; // 恢复文字选中
        document.body.style.cursor = '';
    };

    // --- 数据筛选逻辑 ---
    // --- 数据筛选与排序逻辑 (修改版) ---
    const { timelineTasks, memoTasks } = useMemo(() => {
        if (!activeGroupId) return { timelineTasks: [], memoTasks: [] };
        
        const groupTasks = tasks.filter(t => t.linkedInfo?.groupId === activeGroupId);
        
        // 1. 获取带有截止日期的任务 (左侧栏)
        let timeline = groupTasks.filter(t => t.deadline);

        // ✨ 核心修改：根据模式进行排序
        timeline.sort((a, b) => {
            if (isSortByPriority) {
                // === 模式 A: 智能排序 (完成沉底 > 优先级 > 日期) ===
                
                // 1. 完成状态: 未完成(0) 在前，已完成(1) 在后
                if (a.done !== b.done) {
                    return Number(a.done) - Number(b.done);
                }

                // 2. 优先级: 权重小的在前
                const weightA = PRIORITY_WEIGHT[a.category] ?? 99;
                const weightB = PRIORITY_WEIGHT[b.category] ?? 99;
                if (weightA !== weightB) {
                    return weightA - weightB;
                }

                // 3. 如果优先级相同，依然按日期先后排
                return dayjs(a.deadline).valueOf() - dayjs(b.deadline).valueOf();

            } else {
                // === 模式 B: 纯日期排序 (保留你原本的逻辑) ===
                // 纯粹按时间轴，不管有没有做完，适合看“行程流水”
                return dayjs(a.deadline).valueOf() - dayjs(b.deadline).valueOf();
            }
        });

        // 2. 获取无截止日期的任务 (右侧栏 - 保持不变)
        const memo = groupTasks
            .filter(t => !t.deadline) 
            .sort((a, b) => Number(a.done) - Number(b.done)); 

        return { timelineTasks: timeline, memoTasks: memo };
    }, [activeGroupId, tasks, isSortByPriority]); // 👈 注意这里加了 isSortByPriority 依赖
  
    const getStepStatus = (task, index) => {
      if (task.done) return 'finish';
      if (dayjs(task.deadline).isBefore(dayjs(), 'day')) return 'error';
      const firstUndoneIndex = timelineTasks.findIndex(t => !t.done);
      if (index === firstUndoneIndex) return 'process';
      return 'wait';
    };
  
    const handleQuickAdd = () => {
        if(!quickContent) return message.error('请填写内容');
        const deadlineVal = quickDate ? quickDate.format('YYYY-MM-DD') : null; 
        onAddQuickTask({ 
          content: quickContent, 
          deadline: deadlineVal, 
          category: quickCategory, 
          linkedInfo: { groupId: activeGroupId } 
        });
        setQuickContent(''); setQuickDate(null); setQuickCategory('reminder'); 
    };

    const handleSaveMemo = async (groupId, memoData) => {
       // A. 立即更新本地状态 (这样切换页面就不会丢了)
       if (onUpdateGroup) {
           onUpdateGroup(groupId, { memo_data: memoData });
       }

       // B. 异步更新数据库 (静默保存)
       const { error } = await supabase.from('groups').update({ memo_data: memoData }).eq('id', groupId);
       
       if (error) {
           console.error("保存备忘失败", error);
           message.error("云端同步失败，请检查网络");
       }
    };

    const MobileGroupSelector = () => (
        <div style={{ display: 'flex', overflowX: 'auto', gap: 12, padding: '4px 0 12px 0', marginBottom: 8, scrollbarWidth: 'none' }}>
            {sortedGroups.map(item => ( // <--- 这里改成 sortedGroups
                <div key={item.id} onClick={() => setActiveGroupId(item.id)}
                    style={{ 
                        padding: '8px 16px', 
                        borderRadius: 20, 
                        // 如果置顶了，给个特殊的边框或背景微调
                        border: item.is_pinned ? `1px solid ${item.color}` : '1px solid transparent',
                        background: activeGroupId === item.id ? item.color : (isDark ? '#1f1f1f' : '#f0f0f0'), 
                        color: activeGroupId === item.id ? '#fff' : (isDark ? '#aaa' : '#666'), 
                        // ... 其他样式
                    }}>
                    {item.is_pinned && <PushpinFilled style={{marginRight: 4}} />}
                    {item.name}
                </div>
            ))}
        </div>
    );

    return (
      <Row gutter={[16, 16]} style={{ height: '100%' }}>
        {!isMobile && (
            <Col xs={24} md={6} style={{height: '100%'}}>
            <Card style={{...styles.glassCard, height: '100%', overflowY: 'auto'}} title={<span style={{color: isDark ? '#fff' : '#000'}}>团队列表</span>}>
                {/* 4. 修改 List 使用 sortedGroups */}
                <List dataSource={sortedGroups} renderItem={item => ( // <--- 这里改成 sortedGroups
                    <div onClick={() => setActiveGroupId(item.id)} style={{ 
                        padding: '16px', 
                        marginBottom: 12, 
                        borderRadius: 12, 
                        cursor: 'pointer', 
                        background: activeGroupId === item.id ? `linear-gradient(90deg, ${item.color}33 0%, rgba(0,0,0,0) 100%)` : (isDark ? 'rgba(255,255,255,0.05)' : '#f9f9f9'), 
                        borderLeft: activeGroupId === item.id ? `4px solid ${item.color}` : '4px solid transparent', 
                        transition: 'all 0.3s',
                        position: 'relative' // 为绝对定位图标做准备
                    }}>
                    
                    {/* 5. 【新增】置顶按钮 (绝对定位在右上角) */}
                    <div 
                        onClick={(e) => { e.stopPropagation(); onTogglePin(item); }} 
                        style={{
                            position: 'absolute', top: 8, right: 8, 
                            padding: 6, cursor: 'pointer', 
                            color: item.is_pinned ? '#1890ff' : (isDark ? '#666' : '#ccc'),
                            zIndex: 10
                        }}
                    >
                        {item.is_pinned ? <PushpinFilled /> : <PushpinOutlined />}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ color: isDark ? '#fff' : '#333', fontWeight: 600, fontSize: 15, maxWidth: '85%' }}>
                            {item.name}
                        </div>
                    </div>
                    <div style={{ color: isDark ? 'rgba(255,255,255,0.5)' : '#999', fontSize: 12, marginTop: 4 }}>
                        {item.start} 出发
                    </div>
                    </div>
                )} />
            </Card>
            </Col>
        )}

        {/* 主要内容区 */}
        <Col xs={24} md={18} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {isMobile && <MobileGroupSelector />}
            
            {activeGroup ? (
            <Card style={{...styles.glassCard, flex: 1}} bodyStyle={{display: 'flex', flexDirection: 'column', height: '100%'}}>
               {/* 顶部输入栏 */}
               <div style={{ display: 'flex', alignItems: isMobile ? 'flex-start' : 'center', marginBottom: 16, paddingBottom: 16, borderBottom: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e8e8e8', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 16 : 0 }}>
                  <div style={{display: 'flex', alignItems: 'center', flex: 1}}>
                      <div style={{ width: 6, height: 40, background: activeGroup.color, borderRadius: 4, marginRight: 16 }}></div>
                      <div>
                          <Title level={3} style={{ color: isDark ? '#fff' : '#000', margin: 0 }}>{activeGroup.name}</Title>
                          <Text style={{ color: isDark ? 'rgba(255,255,255,0.5)' : '#999' }}>行程规划与执行</Text>
                      </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, background: isDark ? 'rgba(255,255,255,0.05)' : '#f5f5f5', padding: 12, borderRadius: 8, border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e8e8e8', flexDirection: isMobile ? 'column' : 'row', width: isMobile ? '100%' : 'auto' }}>
                      <div style={{display:'flex', gap:8}}>
                          <Select value={quickCategory} onChange={setQuickCategory} style={{width: isMobile ? '40%' : 110}} dropdownStyle={{background: isDark ? '#1f1f1f' : '#fff'}}>{Object.entries(PRIORITY_CONFIG).map(([k,v]) => (<Select.Option key={k} value={k}><Badge color={v.color} text={v.label} /></Select.Option>))}</Select>
                          <DatePicker allowClear placeholder="日期(选填)" style={{width: isMobile ? '60%' : 130}} value={quickDate} onChange={setQuickDate} />
                      </div>
                      <div style={{display:'flex', gap:8, flex:1}}>
                          <Input placeholder="添加任务..." style={{flex: 1}} value={quickContent} onChange={e => setQuickContent(e.target.value)} onPressEnter={handleQuickAdd} />
                          <Button type="primary" icon={<PlusOutlined />} onClick={handleQuickAdd}>添加</Button>
                      </div>
                  </div>
               </div>

               <Row gutter={24} style={{flex: 1, overflow: 'hidden'}}>
                  
                  {/* === 左侧：时间轴 (固定) === */}
                  <Col xs={24} md={12} style={{height: '100%', overflowY: 'auto', paddingRight: 12, borderRight: isMobile ? 'none' : (isDark ? '1px solid #333' : '1px solid #f0f0f0')}}>
                      
                      {/* 标题栏 */}
                      <div style={{marginBottom: 16, display:'flex', alignItems:'center', justifyContent: 'space-between'}}>
                          <div style={{fontWeight: 'bold', color: isDark ? '#fff' : '#333', display:'flex', alignItems:'center', gap: 8}}>
                              <ClockCircleOutlined /> 
                              {/* 动态显示当前标题，提示用户 */}
                              {isSortByPriority ? '智能排序 (优先级)' : '时间轴视图'} 
                              ({timelineTasks.length})
                          </div>
                          
                          <div style={{display: 'flex', gap: 8}}>
                              {/* ✨ 新增：切换排序按钮 */}
                              <Tooltip title={isSortByPriority ? "切换为：纯日期时间轴" : "切换为：优先级排序 (已完成沉底)"}>
                                  <Button 
                                    size="small" 
                                    // 根据状态改变图标或样式
                                    type={isSortByPriority ? "primary" : "default"} 
                                    ghost={isSortByPriority}
                                    icon={isSortByPriority ? <FireOutlined /> : <CalendarOutlined />} 
                                    onClick={() => setIsSortByPriority(!isSortByPriority)}
                                  >
                                      {isSortByPriority ? "按优先级" : "按日期"}
                                  </Button>
                              </Tooltip>

                              {/* 原有的导入按钮 */}
                              <Tooltip title="批量导入 (格式: 事件, 2025-12-01)">
                                  <Button 
                                    type="dashed" 
                                    size="small" 
                                    icon={<ImportOutlined />} 
                                    onClick={() => setIsImportModalOpen(true)}
                                  >
                                      导入
                                  </Button>
                              </Tooltip>
                          </div>
                      </div>
                      {timelineTasks.length > 0 ? (
                          <Steps 
                            direction="vertical" 
                            current={-1} 
                            items={timelineTasks.map((task, index) => {
                                  const status = getStepStatus(task, index);
                                  let icon = <ClockCircleOutlined />;
                                  let subColor = '#999';
                                  if (status === 'finish') { icon = <CheckCircleOutlined />; subColor = '#52c41a'; }
                                  else if (status === 'error') { icon = <ExclamationCircleOutlined />; subColor = '#ff4d4f'; }
                                  else if (status === 'process') { icon = <SyncOutlined spin />; subColor = '#1890ff'; }
                                  
                                  return {
                                      status: status,
                                      icon: (
                                          <div onClick={(e) => { e.stopPropagation(); onToggleTask(task.id, task.done); }} style={{ cursor: 'pointer', fontSize: 22, background: isDark ? '#000' : '#fff', borderRadius: '50%', zIndex: 2 }}>
                                              {icon}
                                          </div>
                                      ),
                                      title: (
                                          <div onClick={() => onEdit(task)} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', width: '100%', opacity: status === 'finish' ? 0.5 : 1 }}>
                                              <div style={{display:'flex', alignItems:'center', gap: 8}}>
                                                  <span style={{ color: isDark ? '#fff' : '#000', fontSize: 16, fontWeight: 500, textDecoration: status === 'finish' ? 'line-through' : 'none' }}>{task.content}</span>
                                              </div>
                                              <div style={{fontSize: 12, marginTop: 4, color: subColor}}>
                                                  <Tag bordered={false} style={{color: subColor, padding: 0}}>{task.deadline}</Tag>
                                              </div>
                                          </div>
                                      ),
                                      // 3. 【修改】这里插入我们的备注框
                                      description: (
                                          <div style={{marginTop: 4}}>
                                              <TaskNoteInput task={task} onSave={handleSaveTaskNote} isDark={isDark} />
                                          </div>
                                      )
                                  }
                              })}
                          />
                      ) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={<span style={{color: '#999'}}>暂无时间节点</span>} />}

                  </Col>

                  {/* ✅ Step 4: 添加 Import Modal */}
                  <Modal
                      title="批量导入关键节点"
                      open={isImportModalOpen}
                      onCancel={() => setIsImportModalOpen(false)}
                      onOk={handleBulkImport}
                      okText="开始识别并导入"
                      cancelText="取消"
                      destroyOnClose
                  >
                      <div style={{marginBottom: 12, color: '#999', fontSize: 13}}>
                          请按行输入，每行必须包含一个日期 (YYYY-MM-DD/YYYYMMDD)。<br/>
                          例如：<br/>
                          1. 发送email, 2025-12-10<br/>
                          2. 预定酒店 2025-12-15<br/>
                          3. 购买机票 20251220
                      </div>
                      <Input.TextArea 
                          rows={8} 
                          value={importText} 
                          onChange={e => setImportText(e.target.value)} 
                          placeholder="在此粘贴文本..."
                      />
                  </Modal>

                  {/* === 右侧：垂直排列 + 拖拽调整 === */}
                  <Col xs={24} md={12} style={{height: '100%', marginTop: isMobile ? 24 : 0}}>
                      {/* 绑定 Ref 到这个容器 */}
                      <div ref={rightColumnRef} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                        
                          {/* --- 上半部分 (高度由 State 控制) --- */}
                          <div style={{
                              height: isMobile ? 'auto' : `${topHeightPercent}%`, 
                              flexShrink: 0, // 禁止自动压缩
                              display: 'flex', flexDirection: 'column', overflow: 'hidden', paddingBottom: 8
                          }}>
                              <div style={{marginBottom: 8, fontWeight: 'bold', color: isDark ? '#fff' : '#333', display:'flex', alignItems:'center', gap: 8}}>
                                  <UnorderedListOutlined /> 待定任务 / 备忘 ({memoTasks.length})
                              </div>
                              
                              <div style={{flex: 1, overflowY: 'auto', background: isDark ? 'rgba(255,255,255,0.02)' : '#fafafa', borderRadius: 8, padding: 8}}>
                                  {memoTasks.length > 0 ? (
                                      memoTasks.map(task => (
                                          <div 
                                              key={task.id} 
                                              onClick={() => onEdit(task)}
                                              style={{
                                                  padding: '8px 10px', marginBottom: 6, background: isDark ? '#1f1f1f' : '#fff',
                                                  borderRadius: 6, border: isDark ? '1px solid #333' : '1px solid #e8e8e8',
                                                  cursor: 'pointer', display: 'flex', gap: 10, alignItems: 'center',
                                                  opacity: task.done ? 0.6 : 1
                                              }}
                                          >
                                              <Checkbox checked={task.done} onClick={(e) => e.stopPropagation()} onChange={() => onToggleTask(task.id, task.done)} />
                                              <div style={{flex: 1, color: isDark ? '#ddd' : '#333', fontSize: 13, textDecoration: task.done ? 'line-through' : 'none', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis'}}>
                                                  {task.content}
                                              </div>
                                              <Popconfirm title="删除" onConfirm={(e) => { e.stopPropagation(); onDelete(task.id); }} okButtonProps={{danger:true}}>
                                                  <DeleteOutlined style={{color: '#999', fontSize: 12}} onClick={(e) => e.stopPropagation()} />
                                              </Popconfirm>
                                          </div>
                                      ))
                                  ) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="无" style={{margin: '10px 0'}} />}
                              </div>
                          </div>

                          {/* --- 拖拽把手 (Resizer) --- */}
                          {!isMobile && (
                             <div 
                                onMouseDown={handleMouseDown}
                                style={{
                                    height: 8, 
                                    cursor: 'row-resize', 
                                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                                    background: isDark ? '#000' : '#fff',
                                    margin: '0 -12px', // 让它视觉上看起来是通栏的
                                    zIndex: 10
                                }}>
                                {/* 这是一个视觉上的小把手 */}
                                <div style={{width: 32, height: 4, borderRadius: 2, background: isDark ? '#333' : '#e0e0e0'}}></div>
                             </div>
                          )}

                          {/* --- 下半部分 (自动占据剩余空间) --- */}
                          <div style={{flex: 1, minHeight: 100, display: 'flex', flexDirection: 'column', overflow: 'hidden', paddingTop: 8}}>
                              <GroupNotepad key={activeGroup.id} group={activeGroup} onSave={handleSaveMemo} isDark={isDark} />
                          </div>

                      </div>
                  </Col>
               </Row>
            </Card>
          ) : <Empty description="请选择一个团队" style={{marginTop: 100}} />}
        </Col>
      </Row>
    );
  };

// --- 主程序 (App) 修改版 ---
const App = () => {
  const [activeTab, setActiveTab] = useState('calendar');
  // ✅ 修改 1: 从 localStorage 读取初始值，如果没有则默认为 false (浅色)
  const [isDarkMode, setIsDarkMode] = useState(() => {
      const saved = localStorage.getItem('travelCalTheme');
      return saved === 'dark';
  });
  // ✅ 修改 2: 当 isDarkMode 变化时，保存到 localStorage
  useEffect(() => {
      localStorage.setItem('travelCalTheme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // 1. Session 状态
  const [session, setSession] = useState(null);
  const [groups, setGroups] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // 2. 响应式检测
  const screens = useBreakpoint();
  const isMobile = (screens.xs || !screens.md); // 适配逻辑增强：XS或非MD以上视为Mobile
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // 1. 【新增】处理置顶的函数
  const handleTogglePin = async (group) => {
      const newStatus = !group.is_pinned;
      
      // 乐观更新 (先改界面，感觉快)
      setGroups(prev => prev.map(g => g.id === group.id ? { ...g, is_pinned: newStatus } : g));

      // 提交到数据库
      const { error } = await supabase
          .from('groups')
          .update({ is_pinned: newStatus })
          .eq('id', group.id);

      if (error) {
          message.error('置顶状态更新失败');
          // 回滚
          setGroups(prev => prev.map(g => g.id === group.id ? { ...g, is_pinned: !newStatus } : g));
      } else {
          message.success(newStatus ? '已置顶' : '已取消置顶');
      }
  };

  // 3. 监听登录状态
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if(!session) { setGroups([]); setTasks([]); }
    });

    return () => subscription.unsubscribe();
  }, []);

  // 4. Fetch 数据
  const fetchData = async () => {
    if (!session) return;
    try {
        setLoading(true);
        const { data: groupsData, error: gErr } = await supabase.from('groups').select('*').eq('user_id', session.user.id);
        const { data: tasksData, error: tErr } = await supabase.from('tasks').select('*').eq('user_id', session.user.id);
        
        if (gErr) throw gErr;
        if (tErr) throw tErr;

        if (groupsData) setGroups(groupsData);
        if (tasksData) setTasks(tasksData);
    } catch (error) {
        message.error('数据同步失败: ' + error.message);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [session]);

  const [groupModalOpen, setGroupModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [groupForm] = Form.useForm();

  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskForm] = Form.useForm();

  const styles = getStyles(isDarkMode);

  // --- Handlers ---

  const openEditGroup = (group) => { 
    setEditingGroup(group); 
    groupForm.setFieldsValue({ 
        id: group.id, name: group.name, 
        dates: [dayjs(group.start), dayjs(group.end)], 
        color: group.color 
    }); 
    setGroupModalOpen(true); 
  };
  const openCreateGroup = () => { setEditingGroup(null); groupForm.resetFields(); setGroupModalOpen(true); };
  
  const handleGroupSubmit = async (values) => {
    const safeId = editingGroup ? editingGroup.id : (values.id ? values.id.trim() : '');
    const safeName = values.name ? values.name.trim() : '';

    if (!safeId || !safeName) { message.error('团号和团名不能为空'); return; }
    if (!values.dates || values.dates.length < 2) { message.error('请选择日期'); return; }

    const groupData = { 
        id: safeId, 
        name: safeName, 
        start: values.dates[0].format('YYYY-MM-DD'), 
        end: values.dates[1].format('YYYY-MM-DD'), 
        color: values.color,
        user_id: session.user.id
    };

    const { error } = await supabase.from('groups').upsert(groupData);
    if (error) { 
        console.error(error); 
        message.error('保存失败: ' + error.message); 
        return; 
    }

    if (editingGroup) { 
        setGroups(prev => prev.map(g => g.id === safeId ? { ...g, ...groupData } : g)); 
        message.success('团务信息已同步');
    } else { 
        setGroups(prev => [...prev, groupData]); 
        message.success('新团已发布');
    }
    setGroupModalOpen(false);
  };

  const handleDeleteGroup = async () => {
      if (!editingGroup) return;
      const { error } = await supabase.from('groups').delete().eq('id', editingGroup.id);
      
      if (error) { message.error('删除失败'); return; }

      setTasks(prev => prev.map(t => t.linkedInfo?.groupId === editingGroup.id ? { ...t, linkedInfo: null } : t));
      setGroups(prev => prev.filter(g => g.id !== editingGroup.id));
      setGroupModalOpen(false);
      message.success('团队已删除');
  };
  
  const handleUpdateGroupLocal = (groupId, newData) => {
    setGroups(prevGroups => 
      prevGroups.map(g => g.id === groupId ? { ...g, ...newData } : g)
    );
  };

  const openCreateTask = () => {
      setEditingTask(null);
      taskForm.resetFields();
      setTaskModalOpen(true);
  };

  const openEditTask = (task) => {
      setEditingTask(task);
      taskForm.setFieldsValue({
          content: task.content,
          category: task.category,
          
          // ❌ 原代码: deadline: dayjs(task.deadline),
          // ✅ 修改为: 有日期才转 dayjs，没日期这就传 null (这样输入框就是空的)
          deadline: task.deadline ? dayjs(task.deadline) : null,
          
          groupId: task.linkedInfo ? task.linkedInfo.groupId : undefined
      });
      setTaskModalOpen(true);
  };

  const handleTaskSubmit = async (values) => {
      // 这里的校验逻辑：如果没选日期，就允许提交，但必须处理数据格式
      
      const newTaskData = {
          content: values.content,
          category: values.category,
          
          deadline: values.deadline ? values.deadline.format('YYYY-MM-DD') : null,
          
          linkedInfo: values.groupId ? { groupId: values.groupId } : null,
          user_id: session.user.id
      };

      if (editingTask) {
          const { error } = await supabase.from('tasks').update(newTaskData).eq('id', editingTask.id);
          if (error) { message.error('更新失败'); return; }

          setTasks(prev => prev.map(t => t.id === editingTask.id ? { ...t, ...newTaskData } : t));
          message.success('任务已更新');
      } else {
          const id = Date.now();
          const { error } = await supabase.from('tasks').insert([{ id, done: false, ...newTaskData }]);
          if (error) { message.error('创建失败: ' + error.message); return; }

          setTasks(prev => [...prev, { id, done: false, ...newTaskData }]);
          message.success('新任务已创建');
      }
      setTaskModalOpen(false);
  };

  const handleDeleteTask = async (id) => {
      const { error } = await supabase.from('tasks').delete().eq('id', id);
      if (error) { console.error(error); message.error('删除失败'); return; }

      setTasks(tasks.filter(t => t.id !== id));
      message.success('任务已删除');
  };

  const handleTaskToggle = async (id, currentDoneStatus) => {
      const newStatus = !currentDoneStatus;
      setTasks(prev => prev.map(t => t.id === id ? { ...t, done: newStatus } : t));

      const { error } = await supabase.from('tasks').update({ done: newStatus }).eq('id', id);
      if (error) {
          setTasks(prev => prev.map(t => t.id === id ? { ...t, done: currentDoneStatus } : t));
          message.error('状态同步失败');
      }
  };

  const handleCreateTaskDirect = async (newTaskObj) => {
      const id = Date.now();
      const finalTask = { id, done: false, ...newTaskObj, user_id: session.user.id };
      
      const { error } = await supabase.from('tasks').insert([finalTask]);
      if (error) { message.error('创建失败: ' + error.message); return; }

      setTasks(prev => [...prev, finalTask]);
      message.success('任务已添加');
  };

  // --- 新增：批量导入任务 ---
  // --- 新增：批量导入任务 ---
  const handleImportTasks = async (newTasksArray) => {
      // 1. 为每个任务加上 ID 和 用户ID
      const tasksToInsert = newTasksArray.map((t, index) => ({
          ...t,
          // ✅ 修复：使用整数 ID。
          // Date.now() 是毫秒整数，加上 index 防止批量插入时 ID 重复，
          // 再加上一个随机整数防止与旧数据冲突。
          id: Date.now() + index + Math.floor(Math.random() * 1000), 
          done: false,
          user_id: session.user.id
      }));

      // 2. 存入 Supabase
      const { error } = await supabase.from('tasks').insert(tasksToInsert);
      
      if (error) {
          console.error(error); // 打印详细错误方便调试
          message.error('导入失败: ' + error.message);
          return;
      }

      // 3. 更新本地状态
      setTasks(prev => [...prev, ...tasksToInsert]);
      message.success(`成功导入 ${tasksToInsert.length} 个节点`);
  };
  
  const handleSignOut = async () => {
      // ⚡️ 核心修改：添加 { scope: 'local' }
      // 意思就是： "别管服务器那边怎么样，只把我自己浏览器里的登录信息删了就行"
      const { error } = await supabase.auth.signOut({ scope: 'local' });

      if (error) {
          console.warn("本地退出遇到问题:", error.message);
      }

      // 强制清空 React 状态，切回登录页
      setSession(null);
      setGroups([]);
      setTasks([]);
      
      message.success('已退出登录');
  };

  if (!session) {
      return <AuthPage />;
  }

  if (loading) {
      return (
        <div style={{width:'100vw', height:'100vh', display:'flex', justifyContent:'center', alignItems:'center', background: isDarkMode?'#000':'#fff'}}>
            <Spin size="large" tip="正在同步个人数据..." />
        </div>
      );
  }

  return (
    <ConfigProvider locale={locale} theme={{ algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm, token: { colorPrimary: '#1890ff', borderRadius: 8 } }}>
      <Layout style={styles.layout} hasSider> 
        {!isMobile && (
          <Sider width={220} style={styles.sider}>
            <SidebarContent 
                activeTab={activeTab} setActiveTab={setActiveTab} 
                isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} 
                handleSignOut={handleSignOut} groups={groups} 
                onGroupCreate={openCreateGroup} openEditGroup={openEditGroup} 
            />
          </Sider>
        )}

        <Drawer
            placement="left"
            onClose={() => setMobileMenuOpen(false)}
            open={mobileMenuOpen}
            width={260}
            bodyStyle={{ padding: 0, background: isDarkMode ? '#141414' : '#ffffff' }}
            closable={false}
        >
             <SidebarContent 
                activeTab={activeTab} setActiveTab={setActiveTab} 
                isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} 
                handleSignOut={handleSignOut} groups={groups} 
                onGroupCreate={openCreateGroup} openEditGroup={openEditGroup} 
                closeDrawer={() => setMobileMenuOpen(false)}
            />
        </Drawer>
        
        <Layout style={styles.innerLayout}>
          <Header style={{ ...styles.header, padding: isMobile ? '0 16px' : '0 24px' }}>
              <div style={{display:'flex', alignItems:'center', gap: 12}}>
                  {isMobile && <Button type="text" icon={<MenuOutlined style={{color: isDarkMode?'#fff':'#000', fontSize: 18}} />} onClick={() => setMobileMenuOpen(true)} />}
                  <Title level={4} style={{ margin: 0, color: isDarkMode ? '#fff' : '#000', fontSize: isMobile ? 18 : 20 }}>
                    {activeTab === 'calendar' ? '日历总览' : activeTab === 'tasks' ? '待办中心' : '流程追踪'}
                  </Title>
              </div>
              <div style={{display:'flex', alignItems:'center', gap:8}}>
                  {!isMobile && <Tag color="blue">{session.user.email}</Tag>}
                  <Avatar style={{ backgroundColor: '#1890ff' }}>{session.user.email[0].toUpperCase()}</Avatar>
              </div>
          </Header>
          <Content style={{ padding: isMobile ? 12 : 24, overflowY: 'auto', flex: 1 }}>
            {activeTab === 'calendar' && (
              <CalendarView 
                groups={groups} tasks={tasks} 
                onEditGroup={openEditGroup} 
                onToggleTask={handleTaskToggle} 
                onAddTask={handleCreateTaskDirect}
                onDeleteTask={handleDeleteTask} 
                onEditTask={openEditTask}
                isDark={isDarkMode}
                isMobile={isMobile} 
              />
            )}
            {activeTab === 'tasks' && <TaskBoard tasks={tasks} groups={groups} onToggle={handleTaskToggle} onDelete={handleDeleteTask} onEdit={openEditTask} onCreate={openCreateTask} isDark={isDarkMode} isMobile={isMobile} />}
            {activeTab === 'workflow' && (
                <WorkflowTracker 
                    groups={groups} 
                    tasks={tasks} 
                    onToggleTask={handleTaskToggle} 
                    onAddQuickTask={handleCreateTaskDirect} 
                    // 新增下面这两个 props
                    onDelete={handleDeleteTask}
                    onEdit={openEditTask}
                    isDark={isDarkMode} 
                    isMobile={isMobile} 
                    onUpdateGroup={handleUpdateGroupLocal}
                    onTogglePin={handleTogglePin}
                    onImportTasks={handleImportTasks}
                />
            )}
          </Content>
        </Layout>
        
        <Modal 
            open={groupModalOpen} 
            onCancel={() => setGroupModalOpen(false)} 
            title={editingGroup ? "修改团务信息" : "发布新旅行团"} 
            footer={null} 
            width={isMobile ? '95%' : 500}
            destroyOnClose 
        >
          <Form form={groupForm} layout="vertical" onFinish={handleGroupSubmit}>
            <Form.Item 
                name="id" 
                label="团号 (唯一ID)" 
                rules={[
                    {required: true, message: '请输入团号'},
                    {pattern: /^[A-Za-z0-9-_]+$/, message: '团号只能包含字母、数字、横杠或下划线'}
                ]}
            >
                <Input prefix="#" disabled={!!editingGroup} placeholder="例如: G-SYD-1205" />
            </Form.Item>
            <Form.Item name="name" label="团名" rules={[{required: true, message: '请输入团名'}]}><Input placeholder="例如: 澳洲东海岸" /></Form.Item>
            <Form.Item name="dates" label="出行日期" rules={[{required: true, message: '请选择日期'}]}><RangePicker style={{width: '100%'}} /></Form.Item>
            <Form.Item name="color" label="标记颜色 (主题色)" initialValue="#1890ff">
              <Select placeholder="选择一个主题色" dropdownRender={(menu) => (<div style={{ padding: 8 }}>{menu}</div>)}>
                {COLOR_PALETTE.map(c => (
                  <Select.Option key={c.value} value={c.value}>
                      <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
                          <div style={{width: 16, height: 16, background: c.color, borderRadius: 4, border: '1px solid rgba(255,255,255,0.2)'}}></div>
                          <span>{c.label}</span>
                      </div>
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <div style={{display: 'flex', gap: 12, marginTop: 24}}>
                {editingGroup && (
                    <Popconfirm title="删除团队" description="这将在云端删除团队信息，确定吗？" onConfirm={handleDeleteGroup} okText="确认删除" cancelText="取消" okButtonProps={{danger: true}}>
                        <Button danger size="large" icon={<DeleteOutlined />}>删除</Button>
                    </Popconfirm>
                )}
                <Button type="primary" htmlType="submit" block shape="round" size="large">
                    {editingGroup ? "保存修改" : "立即发布"}
                </Button>
            </div>
          </Form>
        </Modal>
        <Modal 
            title={editingTask ? "编辑任务" : "新建任务"} 
            open={taskModalOpen} 
            onCancel={() => setTaskModalOpen(false)} 
            footer={null} 
            destroyOnClose 
            width={isMobile ? '90%' : 520}
        >
        <Form form={taskForm} onFinish={handleTaskSubmit} layout="vertical">
            {/* ... 之前的 Form.Item 内容保持不变 ... */}
            <Form.Item name="content" label="任务内容" rules={[{ required: true }]}><Input placeholder="例如: 确认机票出票" onPressEnter={() => taskForm.submit()} /></Form.Item>
            <Row gutter={16}>
                <Col span={12}><Form.Item name="category" label="优先级" initialValue="reminder"><Select>{Object.entries(PRIORITY_CONFIG).map(([k, v]) => <Select.Option key={k} value={k}>{v.label}</Select.Option>)}</Select></Form.Item></Col>
                <Col span={12}><Form.Item name="deadline" label="截止日期"><DatePicker style={{width:'100%'}} /></Form.Item></Col>
            </Row>
            <Form.Item name="groupId" label="关联团 (可选)"><Select allowClear>{groups.map(g => <Select.Option key={g.id} value={g.id}>{g.name}</Select.Option>)}</Select></Form.Item>
            
            {/* ✅ 修改底部按钮区域：添加删除按钮 */}
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 24}}>
                <div>
                    {editingTask && (
                        <Popconfirm 
                            title="删除任务" 
                            description="确定要永久删除这个任务吗？" 
                            onConfirm={() => {
                                handleDeleteTask(editingTask.id);
                                setTaskModalOpen(false); // 删除后关闭弹窗
                            }} 
                            okText="删除" 
                            cancelText="再想想" 
                            okButtonProps={{danger: true}}
                        >
                            <Button danger type="dashed" icon={<DeleteOutlined />}>删除任务</Button>
                        </Popconfirm>
                    )}
                </div>
                <div style={{display: 'flex', gap: 10}}>
                    <Button onClick={() => setTaskModalOpen(false)}>取消</Button>
                    <Button type="primary" htmlType="submit">{editingTask ? "保存修改" : "立即创建"}</Button>
                </div>
            </div>
        </Form>
        </Modal>
      </Layout>
    </ConfigProvider>
  );
};

export default App;