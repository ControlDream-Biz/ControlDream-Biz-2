// 完整的双语翻译数据库

export type Language = 'zh' | 'en';

// 导出翻译字典
export const translations: Record<Language, Record<string, string>> = {
  zh: {
    // ========== 导航栏 ==========
    'nav.home': '首页',
    'nav.business': '业务领域',
    'nav.environment': '办公环境',
    'nav.about': '关于我们',
    'nav.culture': '企业文化',
    'nav.contact': '联系我们',
    'nav.menu.open': '打开菜单',
    'nav.menu.close': '关闭菜单',

    // ========== 首页 ==========
    'home.hero.innovation': '游戏创新 · 软件赋能 · 硬件智造',
    'home.hero.subtitle': '三驾马车驱动自主创新',
    'home.hero.description': '创梦计算机系统有限公司致力于为全球用户提供创新的游戏体验、专业的软件解决方案和可靠的硬件产品。',
    'cta.view_products': '查看产品',
    'cta.contact_us': '联系我们',
    'cta.learn_more': '了解更多',

    // ========== 业务领域 ==========
    'business.title': '业务领域',
    'business.subtitle': '三大核心业务，驱动创新未来',
    'business.gaming.title': '游戏业务',
    'business.gaming.description': '打造沉浸式游戏体验，引领互动娱乐新潮流',
    'business.software.title': '软件业务',
    'business.software.description': '提供专业软件解决方案，助力企业数字化转型',
    'business.hardware.title': '硬件业务',
    'business.hardware.description': '研发高性能硬件产品，构建可靠技术基石',

    // ========== 办公环境 ==========
    'environment.title': '办公环境',
    'environment.subtitle': '现代化的工作空间，激发无限创造力',
    'environment.description': '创梦计算机系统有限公司坐落于科技创新园区，拥有现代化的办公环境和一流的工作设施。',
    'environment.features.modern': '现代化设计',
    'environment.features.comfortable': '舒适办公空间',
    'environment.features.technological': '科技感氛围',
    'environment.features.green': '绿色环保',

    // ========== 关于我们 ==========
    'about.title': '关于我们',
    'about.subtitle': '创新驱动发展，技术改变世界',
    'about.company.name': '创梦计算机系统有限公司',
    'about.company.description': '创梦计算机系统有限公司是一家专注于游戏开发、软件服务和硬件研发的创新科技企业。自成立以来，我们始终秉承"创新驱动发展，技术改变世界"的理念，致力于为全球用户提供高品质的产品和服务。',
    'about.mission.title': '企业使命',
    'about.mission.description': '通过技术创新，为用户创造价值，为社会贡献力量。',
    'about.vision.title': '企业愿景',
    'about.vision.description': '成为全球领先的科技企业，引领行业创新发展。',
    'about.values.title': '核心价值观',
    'about.values.innovation': '创新',
    'about.values.quality': '品质',
    'about.values.service': '服务',
    'about.values.cooperation': '合作',

    // ========== 企业文化 ==========
    'culture.title': '企业文化',
    'culture.subtitle': '打造学习型组织，培养创新型人才',
    'culture.description': '创梦计算机系统有限公司注重人才培养，建立了完善的培训体系和激励机制，为员工提供广阔的发展平台。',
    'culture.learning.title': '学习型组织',
    'culture.learning.description': '持续学习，不断进步，构建知识共享平台。',
    'culture.innovation.title': '创新文化',
    'culture.innovation.description': '鼓励创新，包容失败，营造浓厚的创新氛围。',
    'culture.teamwork.title': '团队协作',
    'culture.teamwork.description': '团结协作，互助共赢，打造高效团队。',
    'culture.growth.title': '共同成长',
    'culture.growth.description': '企业与员工共同成长，分享发展成果。',

    // ========== 联系我们 ==========
    'contact.title': '联系我们',
    'contact.subtitle': '期待与您合作，共创美好未来',
    'contact.description': '如果您有任何问题或建议，欢迎随时与我们联系。',
    'contact.form.name': '姓名',
    'contact.form.email': '邮箱',
    'contact.form.phone': '电话',
    'contact.form.message': '留言内容',
    'contact.form.submit': '提交',
    'contact.form.reset': '重置',
    'contact.form.success': '提交成功，我们将尽快与您联系！',
    'contact.form.error': '提交失败，请稍后重试。',
    'contact.info.title': '联系方式',
    'contact.info.address': '地址：科技创新园区A栋',
    'contact.info.phone': '电话：400-123-4567',
    'contact.info.email': '邮箱：contact@chuangmeng.com',
    'contact.info.hours': '工作时间：周一至周五 9:00-18:00',

    // ========== 页脚 ==========
    'footer.innovation_service': '创新服务',
    'footer.product_center': '产品中心',
    'footer.about_us': '关于我们',
    'footer.news': '新闻资讯',
    'footer.cooperation': '合作与支持',
    'footer.contact': '联系我们',
    'footer.copyright': '© 2026 创梦计算机系统有限公司. 保留所有权利。',
    'footer.rights': '版权所有 | 隐私政策 | 使用条款',

    // ========== 通用按钮 ==========
    'button.submit': '提交',
    'button.cancel': '取消',
    'button.confirm': '确认',
    'button.close': '关闭',
    'button.back': '返回',
    'button.next': '下一步',
    'button.prev': '上一步',
    'button.save': '保存',
    'button.delete': '删除',
    'button.edit': '编辑',
    'button.view': '查看',
    'button.search': '搜索',
    'button.download': '下载',
    'button.upload': '上传',

    // ========== 浮动按钮 ==========
    'floating.back_to_top': '回到顶部',
    'floating.back_to_top.single': '往上翻页',
    'floating.back_to_top.double': '回到首页',
    'floating.customer_service': '联系客服',
    'floating.customer_service.popup': '需要帮助？点击联系客服',

    // ========== 错误提示 ==========
    'error.network': '网络错误，请检查您的网络连接。',
    'error.server': '服务器错误，请稍后重试。',
    'error.invalid': '输入无效，请检查后重试。',
    'error.required': '此项为必填项。',
    'error.email': '请输入有效的邮箱地址。',
    'error.phone': '请输入有效的电话号码。',

    // ========== 成功提示 ==========
    'success.saved': '保存成功！',
    'success.submitted': '提交成功！',
    'success.deleted': '删除成功！',
    'success.updated': '更新成功！',
    'success.created': '创建成功！',

    // ========== 语言切换 ==========
    'language.switch': '切换语言',
    'language.chinese': '中文',
    'language.english': 'English',

    // ========== 团队介绍 ==========
    'team.title': '团队介绍',
    'team.subtitle': '专业的团队，铸就专业的品质',
    'team.description': '创梦计算机系统有限公司拥有一支由资深工程师、设计师和管理专家组成的专业团队，为公司的创新发展提供了坚实的人才保障。',

    // ========== 新闻资讯 ==========
    'news.title': '新闻资讯',
    'news.subtitle': '了解最新动态，把握行业趋势',
    'news.more': '查看更多',

    // ========== 在线客服 ==========
    'chat.title': '在线客服',
    'chat.placeholder': '请输入您的问题...',
    'chat.send': '发送',
    'chat.welcome': '您好！我是创梦客服，有什么可以帮助您的吗？',
    'chat.connecting': '正在连接客服...',
    'chat.offline': '客服暂时不在线，请留言。',
  },
  en: {
    // ========== Navigation ==========
    'nav.home': 'Home',
    'nav.business': 'Business',
    'nav.environment': 'Environment',
    'nav.about': 'About Us',
    'nav.culture': 'Culture',
    'nav.contact': 'Contact',
    'nav.menu.open': 'Open Menu',
    'nav.menu.close': 'Close Menu',

    // ========== Home ==========
    'home.hero.innovation': 'Gaming Innovation · Software Empowerment · Hardware Intelligence',
    'home.hero.subtitle': 'Three Pillars Driving Independent Innovation',
    'home.hero.description': 'Chuangmeng Computer System Co., Ltd. is dedicated to providing innovative gaming experiences, professional software solutions, and reliable hardware products to users worldwide.',
    'cta.view_products': 'View Products',
    'cta.contact_us': 'Contact Us',
    'cta.learn_more': 'Learn More',

    // ========== Business ==========
    'business.title': 'Business Areas',
    'business.subtitle': 'Three Core Businesses Driving Innovation',
    'business.gaming.title': 'Gaming Business',
    'business.gaming.description': 'Creating immersive gaming experiences, leading the new trend of interactive entertainment',
    'business.software.title': 'Software Business',
    'business.software.description': 'Providing professional software solutions to help enterprises with digital transformation',
    'business.hardware.title': 'Hardware Business',
    'business.hardware.description': 'Developing high-performance hardware products, building a reliable technical foundation',

    // ========== Environment ==========
    'environment.title': 'Office Environment',
    'environment.subtitle': 'Modern Workspace Inspiring Unlimited Creativity',
    'environment.description': 'Chuangmeng Computer System Co., Ltd. is located in the technology innovation park, featuring a modern office environment and state-of-the-art facilities.',
    'environment.features.modern': 'Modern Design',
    'environment.features.comfortable': 'Comfortable Workspace',
    'environment.features.technological': 'Technological Atmosphere',
    'environment.features.green': 'Green & Eco-friendly',

    // ========== About Us ==========
    'about.title': 'About Us',
    'about.subtitle': 'Innovation Drives Development, Technology Changes the World',
    'about.company.name': 'Chuangmeng Computer System Co., Ltd.',
    'about.company.description': 'Chuangmeng Computer System Co., Ltd. is an innovative technology company focused on game development, software services, and hardware research and development. Since its establishment, we have always adhered to the philosophy of "Innovation Drives Development, Technology Changes the World," committed to providing high-quality products and services to global users.',
    'about.mission.title': 'Corporate Mission',
    'about.mission.description': 'Create value for users through technological innovation and contribute to society.',
    'about.vision.title': 'Corporate Vision',
    'about.vision.description': 'Become a leading global technology enterprise, leading industry innovation and development.',
    'about.values.title': 'Core Values',
    'about.values.innovation': 'Innovation',
    'about.values.quality': 'Quality',
    'about.values.service': 'Service',
    'about.values.cooperation': 'Cooperation',

    // ========== Culture ==========
    'culture.title': 'Corporate Culture',
    'culture.subtitle': 'Building a Learning Organization, Cultivating Innovative Talent',
    'culture.description': 'Chuangmeng Computer System Co., Ltd. focuses on talent development, establishing a comprehensive training system and incentive mechanisms to provide employees with broad development platforms.',
    'culture.learning.title': 'Learning Organization',
    'culture.learning.description': 'Continuous learning, continuous improvement, building a knowledge-sharing platform.',
    'culture.innovation.title': 'Innovation Culture',
    'culture.innovation.description': 'Encouraging innovation, embracing failure, creating a strong innovation atmosphere.',
    'culture.teamwork.title': 'Team Collaboration',
    'culture.teamwork.description': 'Unity and collaboration, mutual benefit, building an efficient team.',
    'culture.growth.title': 'Growing Together',
    'culture.growth.description': 'Company and employees grow together, sharing development results.',

    // ========== Contact ==========
    'contact.title': 'Contact Us',
    'contact.subtitle': 'Looking Forward to Cooperating with You',
    'contact.description': 'If you have any questions or suggestions, please feel free to contact us.',
    'contact.form.name': 'Name',
    'contact.form.email': 'Email',
    'contact.form.phone': 'Phone',
    'contact.form.message': 'Message',
    'contact.form.submit': 'Submit',
    'contact.form.reset': 'Reset',
    'contact.form.success': 'Submitted successfully! We will contact you soon.',
    'contact.form.error': 'Submission failed, please try again later.',
    'contact.info.title': 'Contact Information',
    'contact.info.address': 'Address: Building A, Technology Innovation Park',
    'contact.info.phone': 'Phone: 400-123-4567',
    'contact.info.email': 'Email: contact@chuangmeng.com',
    'contact.info.hours': 'Hours: Monday to Friday 9:00-18:00',

    // ========== Footer ==========
    'footer.innovation_service': 'Innovation Services',
    'footer.product_center': 'Product Center',
    'footer.about_us': 'About Us',
    'footer.news': 'News',
    'footer.cooperation': 'Cooperation & Support',
    'footer.contact': 'Contact Us',
    'footer.copyright': '© 2026 Chuangmeng Computer System Co., Ltd. All rights reserved.',
    'footer.rights': 'Copyright | Privacy Policy | Terms of Use',

    // ========== Common Buttons ==========
    'button.submit': 'Submit',
    'button.cancel': 'Cancel',
    'button.confirm': 'Confirm',
    'button.close': 'Close',
    'button.back': 'Back',
    'button.next': 'Next',
    'button.prev': 'Previous',
    'button.save': 'Save',
    'button.delete': 'Delete',
    'button.edit': 'Edit',
    'button.view': 'View',
    'button.search': 'Search',
    'button.download': 'Download',
    'button.upload': 'Upload',

    // ========== Floating Buttons ==========
    'floating.back_to_top': 'Back to Top',
    'floating.back_to_top.single': 'Previous Page',
    'floating.back_to_top.double': 'Back to Home',
    'floating.customer_service': 'Customer Service',
    'floating.customer_service.popup': 'Need help? Click to contact customer service',

    // ========== Error Messages ==========
    'error.network': 'Network error, please check your internet connection.',
    'error.server': 'Server error, please try again later.',
    'error.invalid': 'Invalid input, please check and try again.',
    'error.required': 'This field is required.',
    'error.email': 'Please enter a valid email address.',
    'error.phone': 'Please enter a valid phone number.',

    // ========== Success Messages ==========
    'success.saved': 'Saved successfully!',
    'success.submitted': 'Submitted successfully!',
    'success.deleted': 'Deleted successfully!',
    'success.updated': 'Updated successfully!',
    'success.created': 'Created successfully!',

    // ========== Language Switch ==========
    'language.switch': 'Switch Language',
    'language.chinese': '中文',
    'language.english': 'English',

    // ========== Team ==========
    'team.title': 'Our Team',
    'team.subtitle': 'Professional Team, Professional Quality',
    'team.description': 'Chuangmeng Computer System Co., Ltd. has a professional team composed of senior engineers, designers, and management experts, providing solid talent protection for the company\'s innovative development.',

    // ========== News ==========
    'news.title': 'News',
    'news.subtitle': 'Stay Updated, Grasp Industry Trends',
    'news.more': 'View More',

    // ========== Online Chat ==========
    'chat.title': 'Online Support',
    'chat.placeholder': 'Please enter your question...',
    'chat.send': 'Send',
    'chat.welcome': 'Hello! I am Chuangmeng customer service. How can I help you?',
    'chat.connecting': 'Connecting to customer service...',
    'chat.offline': 'Customer service is currently offline. Please leave a message.',
  },
};

// 获取翻译文本的函数
export function t(key: string, language: Language = 'zh'): string {
  return translations[language][key] || key;
}

// 导出默认对象
export default translations;
