import { createContext, useContext, useState, useEffect } from 'react';

const AdminLangContext = createContext();

export const adminTranslations = {
  en: {
    // Layout & Navigation
    adminPanel: 'Admin Panel',
    bialaPublishing: 'Biala Publishing',
    viewPublicSite: 'View Public Site →',
    signOut: 'Sign Out',
    
    // Nav items
    nav: {
      dashboard: 'Dashboard',
      books: 'Books',
      newsUpdates: 'News & Updates',
      media: 'Media',
      subscribers: 'Subscribers',
      waitlist: 'Waitlist',
      orders: 'Orders',
      donations: 'Donations',
      prayerRequests: 'Prayer Requests',
      adminUsers: 'Admin Users',
      socialDistribution: 'Social Distribution',
      settings: 'Settings',
    },
    
    // Dashboard
    dashboard: {
      title: 'Dashboard',
      welcome: "Welcome back! Here's what's happening.",
      totalBooks: 'Total Books',
      totalOrders: 'Total Orders',
      donations: 'Donations',
      subscribers: 'Subscribers',
      recentOrders: 'Recent Orders',
      viewAll: 'View All →',
      quickActions: 'Quick Actions',
      addNewBook: 'Add New Book',
      viewWaitlist: 'View Waitlist',
      manageOrders: 'Manage Orders',
      postUpdate: 'Post Update',
      activityOverview: 'Activity Overview',
      last7days: 'Last 7 days',
      last30days: 'Last 30 days',
      last90days: 'Last 90 days',
      chartPlaceholder: 'Analytics chart will appear here',
      completed: 'completed',
      pending: 'pending',
      processing: 'processing',
    },
    
    // Books
    books: {
      title: 'Books',
      subtitle: 'Manage your book catalog',
      addBook: 'Add Book',
      searchBooks: 'Search books...',
      book: 'Book',
      category: 'Category',
      price: 'Price',
      stock: 'Stock',
      status: 'Status',
      actions: 'Actions',
      loading: 'Loading...',
      noBooks: 'No books found',
      inStock: 'In Stock',
      outOfStock: 'Out of Stock',
      editBook: 'Edit Book',
      addNewBook: 'Add New Book',
      titleEnglish: 'Title (English)',
      titleHebrew: 'Title (Hebrew)',
      author: 'Author',
      description: 'Description',
      availableForSale: 'Available for sale',
      cancel: 'Cancel',
      saveChanges: 'Save Changes',
      confirmDelete: 'Are you sure you want to delete this book?',
      categories: {
        torah: 'Torah',
        chassidus: 'Chassidus',
        prayer: 'Prayer',
        holidays: 'Holidays',
      }
    },
    
    // News
    news: {
      title: 'News & Updates',
      subtitle: 'Manage announcements and updates',
      addNews: 'Add News',
      searchNews: 'Search news...',
      newsTitle: 'Title',
      date: 'Date',
      status: 'Status',
      actions: 'Actions',
      noNews: 'No news found',
      published: 'Published',
      draft: 'Draft',
      editNews: 'Edit News',
      addNewNews: 'Add New News',
      content: 'Content',
      publishNow: 'Publish now',
      confirmDelete: 'Are you sure you want to delete this news item?',
    },
    
    // Media
    media: {
      title: 'Media Library',
      subtitle: 'Manage videos, audio, and images',
      addMedia: 'Add Media',
      searchMedia: 'Search media...',
      mediaTitle: 'Title',
      type: 'Type',
      duration: 'Duration',
      views: 'Views',
      actions: 'Actions',
      noMedia: 'No media found',
      video: 'Video',
      audio: 'Audio',
      image: 'Image',
      editMedia: 'Edit Media',
      addNewMedia: 'Add New Media',
      url: 'URL',
      confirmDelete: 'Are you sure you want to delete this media?',
    },
    
    // Subscribers
    subscribers: {
      title: 'Newsletter Subscribers',
      subtitle: 'Manage email subscribers',
      exportCsv: 'Export CSV',
      searchSubscribers: 'Search subscribers...',
      email: 'Email',
      subscribedOn: 'Subscribed On',
      status: 'Status',
      actions: 'Actions',
      noSubscribers: 'No subscribers found',
      active: 'Active',
      unsubscribed: 'Unsubscribed',
      confirmDelete: 'Are you sure you want to remove this subscriber?',
    },
    
    // Waitlist
    waitlist: {
      title: 'Book Waitlist',
      subtitle: 'People waiting for out-of-stock books',
      searchWaitlist: 'Search waitlist...',
      customer: 'Customer',
      book: 'Book',
      requestedOn: 'Requested On',
      notified: 'Notified',
      actions: 'Actions',
      noWaitlist: 'No waitlist entries',
      yes: 'Yes',
      no: 'No',
      confirmDelete: 'Are you sure you want to remove this entry?',
    },
    
    // Orders
    orders: {
      title: 'Orders',
      subtitle: 'Manage customer orders',
      searchOrders: 'Search orders...',
      orderId: 'Order ID',
      customer: 'Customer',
      items: 'Items',
      total: 'Total',
      status: 'Status',
      date: 'Date',
      actions: 'Actions',
      noOrders: 'No orders found',
      orderDetails: 'Order Details',
      shippingAddress: 'Shipping Address',
      paymentMethod: 'Payment Method',
      updateStatus: 'Update Status',
      close: 'Close',
      statuses: {
        pending: 'Pending',
        processing: 'Processing',
        shipped: 'Shipped',
        completed: 'Completed',
        cancelled: 'Cancelled',
      }
    },
    
    // Donations
    donations: {
      title: 'Donations',
      subtitle: 'View and manage donations',
      totalDonations: 'Total Donations',
      thisMonth: 'This Month',
      searchDonations: 'Search donations...',
      donor: 'Donor',
      amount: 'Amount',
      purpose: 'Purpose',
      date: 'Date',
      status: 'Status',
      noDonations: 'No donations found',
      completed: 'Completed',
      pending: 'Pending',
      purposes: {
        institutions: 'Institutions',
        books: 'Book Publishing',
        events: 'Events',
        general: 'General',
      }
    },
    
    // Prayer Requests (Kvitel)
    kvitel: {
      title: 'Prayer Requests',
      subtitle: 'Manage kvitel submissions',
      exportCsv: 'Export CSV',
      searchKvitel: 'Search requests...',
      name: 'Name',
      email: 'Email',
      language: 'Language',
      date: 'Date',
      actions: 'Actions',
      noKvitel: 'No prayer requests found',
      details: 'Details',
      additionalNames: 'Additional Names',
      blessingFor: 'Blessing For',
      phone: 'Phone',
      address: 'Address',
      embedOptions: 'Embed Options',
      embedDescription: 'Use these URLs or code to embed the Kvitel form on other websites:',
      fullPage: 'Full Page',
      embedMode: 'Embed Mode (English)',
      embedModeHebrew: 'Embed Mode (Hebrew)',
      iframeCode: 'iFrame Code',
      confirmDelete: 'Are you sure you want to delete this prayer request?',
    },
    
    // Admin Users
    users: {
      title: 'Admin Users',
      subtitle: 'Manage admin accounts',
      addUser: 'Add User',
      searchUsers: 'Search users...',
      name: 'Name',
      email: 'Email',
      role: 'Role',
      lastLogin: 'Last Login',
      status: 'Status',
      actions: 'Actions',
      noUsers: 'No users found',
      editUser: 'Edit User',
      addNewUser: 'Add New User',
      password: 'Password',
      leaveBlank: '(leave blank to keep current)',
      active: 'Active',
      inactive: 'Inactive',
      roles: {
        admin: 'Admin',
        editor: 'Editor',
        viewer: 'Viewer',
      },
      confirmDelete: 'Are you sure you want to delete this user?',
    },
    
    // Social Distribution
    social: {
      title: 'Social Distribution',
      subtitle: 'Share updates to social platforms',
      createPost: 'Create Post',
      telegram: 'Telegram',
      whatsapp: 'WhatsApp',
      facebook: 'Facebook',
      postContent: 'Post Content',
      selectPlatforms: 'Select Platforms',
      schedule: 'Schedule (optional)',
      postNow: 'Post Now',
      recentPosts: 'Recent Posts',
      noPosts: 'No posts yet',
      posted: 'Posted',
      scheduled: 'Scheduled',
      failed: 'Failed',
    },
    
    // Settings
    settings: {
      title: 'Settings',
      subtitle: 'Configure system settings',
      general: 'General Settings',
      siteName: 'Site Name',
      siteDescription: 'Site Description',
      contactEmail: 'Contact Email',
      save: 'Save Settings',
      email: 'Email Settings',
      smtpHost: 'SMTP Host',
      smtpPort: 'SMTP Port',
      smtpUser: 'SMTP User',
      smtpPassword: 'SMTP Password',
      payment: 'Payment Settings',
      stripeKey: 'Stripe Public Key',
      paypalId: 'PayPal Client ID',
      testConnection: 'Test Connection',
    },
    
    // Common
    common: {
      loading: 'Loading...',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      view: 'View',
      search: 'Search',
      actions: 'Actions',
      status: 'Status',
      date: 'Date',
      close: 'Close',
      yes: 'Yes',
      no: 'No',
      confirm: 'Confirm',
      success: 'Success',
      error: 'Error',
      noData: 'No data found',
    }
  },
  
  he: {
    // Layout & Navigation
    adminPanel: 'לוח בקרה',
    bialaPublishing: 'הוצאת ביאלא',
    viewPublicSite: '← צפה באתר',
    signOut: 'התנתק',
    
    // Nav items
    nav: {
      dashboard: 'לוח בקרה',
      books: 'ספרים',
      newsUpdates: 'חדשות ועדכונים',
      media: 'מדיה',
      subscribers: 'נרשמים',
      waitlist: 'רשימת המתנה',
      orders: 'הזמנות',
      donations: 'תרומות',
      prayerRequests: 'בקשות תפילה',
      adminUsers: 'משתמשי מערכת',
      socialDistribution: 'הפצה חברתית',
      settings: 'הגדרות',
    },
    
    // Dashboard
    dashboard: {
      title: 'לוח בקרה',
      welcome: 'ברוך שובך! הנה מה שקורה.',
      totalBooks: 'סה"כ ספרים',
      totalOrders: 'סה"כ הזמנות',
      donations: 'תרומות',
      subscribers: 'נרשמים',
      recentOrders: 'הזמנות אחרונות',
      viewAll: '← צפה בהכל',
      quickActions: 'פעולות מהירות',
      addNewBook: 'הוסף ספר חדש',
      viewWaitlist: 'צפה ברשימת המתנה',
      manageOrders: 'נהל הזמנות',
      postUpdate: 'פרסם עדכון',
      activityOverview: 'סקירת פעילות',
      last7days: '7 ימים אחרונים',
      last30days: '30 ימים אחרונים',
      last90days: '90 ימים אחרונים',
      chartPlaceholder: 'גרף אנליטיקה יופיע כאן',
      completed: 'הושלם',
      pending: 'ממתין',
      processing: 'בטיפול',
    },
    
    // Books
    books: {
      title: 'ספרים',
      subtitle: 'נהל את קטלוג הספרים',
      addBook: 'הוסף ספר',
      searchBooks: 'חפש ספרים...',
      book: 'ספר',
      category: 'קטגוריה',
      price: 'מחיר',
      stock: 'מלאי',
      status: 'סטטוס',
      actions: 'פעולות',
      loading: 'טוען...',
      noBooks: 'לא נמצאו ספרים',
      inStock: 'במלאי',
      outOfStock: 'אזל מהמלאי',
      editBook: 'ערוך ספר',
      addNewBook: 'הוסף ספר חדש',
      titleEnglish: 'כותרת (אנגלית)',
      titleHebrew: 'כותרת (עברית)',
      author: 'מחבר',
      description: 'תיאור',
      availableForSale: 'זמין למכירה',
      cancel: 'ביטול',
      saveChanges: 'שמור שינויים',
      confirmDelete: 'האם אתה בטוח שברצונך למחוק ספר זה?',
      categories: {
        torah: 'תורה',
        chassidus: 'חסידות',
        prayer: 'תפילה',
        holidays: 'חגים',
      }
    },
    
    // News
    news: {
      title: 'חדשות ועדכונים',
      subtitle: 'נהל הודעות ועדכונים',
      addNews: 'הוסף חדשות',
      searchNews: 'חפש חדשות...',
      newsTitle: 'כותרת',
      date: 'תאריך',
      status: 'סטטוס',
      actions: 'פעולות',
      noNews: 'לא נמצאו חדשות',
      published: 'פורסם',
      draft: 'טיוטה',
      editNews: 'ערוך חדשות',
      addNewNews: 'הוסף חדשות חדשות',
      content: 'תוכן',
      publishNow: 'פרסם עכשיו',
      confirmDelete: 'האם אתה בטוח שברצונך למחוק פריט חדשות זה?',
    },
    
    // Media
    media: {
      title: 'ספריית מדיה',
      subtitle: 'נהל סרטונים, אודיו ותמונות',
      addMedia: 'הוסף מדיה',
      searchMedia: 'חפש מדיה...',
      mediaTitle: 'כותרת',
      type: 'סוג',
      duration: 'משך',
      views: 'צפיות',
      actions: 'פעולות',
      noMedia: 'לא נמצאה מדיה',
      video: 'וידאו',
      audio: 'אודיו',
      image: 'תמונה',
      editMedia: 'ערוך מדיה',
      addNewMedia: 'הוסף מדיה חדשה',
      url: 'קישור',
      confirmDelete: 'האם אתה בטוח שברצונך למחוק מדיה זו?',
    },
    
    // Subscribers
    subscribers: {
      title: 'נרשמים לרשימת דיוור',
      subtitle: 'נהל מנויי אימייל',
      exportCsv: 'ייצא CSV',
      searchSubscribers: 'חפש נרשמים...',
      email: 'אימייל',
      subscribedOn: 'תאריך הרשמה',
      status: 'סטטוס',
      actions: 'פעולות',
      noSubscribers: 'לא נמצאו נרשמים',
      active: 'פעיל',
      unsubscribed: 'בוטל רישום',
      confirmDelete: 'האם אתה בטוח שברצונך להסיר מנוי זה?',
    },
    
    // Waitlist
    waitlist: {
      title: 'רשימת המתנה לספרים',
      subtitle: 'אנשים הממתינים לספרים שאזלו',
      searchWaitlist: 'חפש ברשימת המתנה...',
      customer: 'לקוח',
      book: 'ספר',
      requestedOn: 'תאריך בקשה',
      notified: 'קיבל הודעה',
      actions: 'פעולות',
      noWaitlist: 'אין רשומות ברשימת המתנה',
      yes: 'כן',
      no: 'לא',
      confirmDelete: 'האם אתה בטוח שברצונך להסיר רשומה זו?',
    },
    
    // Orders
    orders: {
      title: 'הזמנות',
      subtitle: 'נהל הזמנות לקוחות',
      searchOrders: 'חפש הזמנות...',
      orderId: 'מזהה הזמנה',
      customer: 'לקוח',
      items: 'פריטים',
      total: 'סה"כ',
      status: 'סטטוס',
      date: 'תאריך',
      actions: 'פעולות',
      noOrders: 'לא נמצאו הזמנות',
      orderDetails: 'פרטי הזמנה',
      shippingAddress: 'כתובת משלוח',
      paymentMethod: 'אמצעי תשלום',
      updateStatus: 'עדכן סטטוס',
      close: 'סגור',
      statuses: {
        pending: 'ממתין',
        processing: 'בטיפול',
        shipped: 'נשלח',
        completed: 'הושלם',
        cancelled: 'בוטל',
      }
    },
    
    // Donations
    donations: {
      title: 'תרומות',
      subtitle: 'צפה ונהל תרומות',
      totalDonations: 'סה"כ תרומות',
      thisMonth: 'החודש',
      searchDonations: 'חפש תרומות...',
      donor: 'תורם',
      amount: 'סכום',
      purpose: 'ייעוד',
      date: 'תאריך',
      status: 'סטטוס',
      noDonations: 'לא נמצאו תרומות',
      completed: 'הושלם',
      pending: 'ממתין',
      purposes: {
        institutions: 'מוסדות',
        books: 'הוצאת ספרים',
        events: 'אירועים',
        general: 'כללי',
      }
    },
    
    // Prayer Requests (Kvitel)
    kvitel: {
      title: 'בקשות תפילה',
      subtitle: 'נהל הגשות קוויטל',
      exportCsv: 'ייצא CSV',
      searchKvitel: 'חפש בקשות...',
      name: 'שם',
      email: 'אימייל',
      language: 'שפה',
      date: 'תאריך',
      actions: 'פעולות',
      noKvitel: 'לא נמצאו בקשות תפילה',
      details: 'פרטים',
      additionalNames: 'שמות נוספים',
      blessingFor: 'ברכה ל',
      phone: 'טלפון',
      address: 'כתובת',
      embedOptions: 'אפשרויות הטמעה',
      embedDescription: 'השתמש בקישורים או קוד אלה להטמעת טופס הקוויטל באתרים אחרים:',
      fullPage: 'עמוד מלא',
      embedMode: 'מצב הטמעה (אנגלית)',
      embedModeHebrew: 'מצב הטמעה (עברית)',
      iframeCode: 'קוד iFrame',
      confirmDelete: 'האם אתה בטוח שברצונך למחוק בקשת תפילה זו?',
    },
    
    // Admin Users
    users: {
      title: 'משתמשי מערכת',
      subtitle: 'נהל חשבונות מנהלים',
      addUser: 'הוסף משתמש',
      searchUsers: 'חפש משתמשים...',
      name: 'שם',
      email: 'אימייל',
      role: 'תפקיד',
      lastLogin: 'כניסה אחרונה',
      status: 'סטטוס',
      actions: 'פעולות',
      noUsers: 'לא נמצאו משתמשים',
      editUser: 'ערוך משתמש',
      addNewUser: 'הוסף משתמש חדש',
      password: 'סיסמה',
      leaveBlank: '(השאר ריק לשמור הנוכחית)',
      active: 'פעיל',
      inactive: 'לא פעיל',
      roles: {
        admin: 'מנהל',
        editor: 'עורך',
        viewer: 'צופה',
      },
      confirmDelete: 'האם אתה בטוח שברצונך למחוק משתמש זה?',
    },
    
    // Social Distribution
    social: {
      title: 'הפצה חברתית',
      subtitle: 'שתף עדכונים ברשתות חברתיות',
      createPost: 'צור פוסט',
      telegram: 'טלגרם',
      whatsapp: 'וואטסאפ',
      facebook: 'פייסבוק',
      postContent: 'תוכן הפוסט',
      selectPlatforms: 'בחר פלטפורמות',
      schedule: 'תזמון (אופציונלי)',
      postNow: 'פרסם עכשיו',
      recentPosts: 'פוסטים אחרונים',
      noPosts: 'אין פוסטים עדיין',
      posted: 'פורסם',
      scheduled: 'מתוזמן',
      failed: 'נכשל',
    },
    
    // Settings
    settings: {
      title: 'הגדרות',
      subtitle: 'הגדר הגדרות מערכת',
      general: 'הגדרות כלליות',
      siteName: 'שם האתר',
      siteDescription: 'תיאור האתר',
      contactEmail: 'אימייל ליצירת קשר',
      save: 'שמור הגדרות',
      email: 'הגדרות אימייל',
      smtpHost: 'שרת SMTP',
      smtpPort: 'פורט SMTP',
      smtpUser: 'משתמש SMTP',
      smtpPassword: 'סיסמת SMTP',
      payment: 'הגדרות תשלום',
      stripeKey: 'מפתח Stripe',
      paypalId: 'מזהה PayPal',
      testConnection: 'בדוק חיבור',
    },
    
    // Common
    common: {
      loading: 'טוען...',
      save: 'שמור',
      cancel: 'ביטול',
      delete: 'מחק',
      edit: 'ערוך',
      view: 'צפה',
      search: 'חפש',
      actions: 'פעולות',
      status: 'סטטוס',
      date: 'תאריך',
      close: 'סגור',
      yes: 'כן',
      no: 'לא',
      confirm: 'אשר',
      success: 'הצלחה',
      error: 'שגיאה',
      noData: 'לא נמצא מידע',
    }
  }
};

export function AdminLangProvider({ children }) {
  const [adminLang, setAdminLang] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('adminLang') || 'en';
    }
    return 'en';
  });

  useEffect(() => {
    localStorage.setItem('adminLang', adminLang);
  }, [adminLang]);

  const t = adminTranslations[adminLang];
  const isRtl = adminLang === 'he';

  const toggleLang = () => {
    setAdminLang(prev => prev === 'en' ? 'he' : 'en');
  };

  return (
    <AdminLangContext.Provider value={{ adminLang, setAdminLang, toggleLang, t, isRtl }}>
      {children}
    </AdminLangContext.Provider>
  );
}

export function useAdminLang() {
  const context = useContext(AdminLangContext);
  if (!context) {
    throw new Error('useAdminLang must be used within AdminLangProvider');
  }
  return context;
}
