module.exports = {
    SSO_SESSION: "sso_ui_konselink",
    SSO_SESSION_INFO: "sso_ui_konselink_info",
    table: {
        KONSELINK_USER: "konselink_user",
        KLIEN_DATA: "klien_data",
        KLIEN_SIBLINGS_DATA: "klien_siblings_data",
        KLIEN_PARENTS_DATA: "klien_parents_data",
        PSIKOLOG_DATA: "psikolog_data",
        PSIKOLOG_SCHEDULE: "psikolog_schedule",
        KONSELINK_CHAT: "konselink_chat",
        PRECONSULTATION_SURVEY: "preconsultation_survey",
        KLIEN_RECORD: "klien_record",
        REGISTRATION_SURVEY: "registration_survey"
    },
    konselingRole: {
        PSIKOLOG: "psikolog",
        KLIEN: "klien"
    },
    parentType: {
        FATHER: 'F',
        MOTHER: 'M'
    },
    UNAUTHORIZED: {
        code: 401,
        message: "Unauthorized, token is not valid, please login again"
    },
    INTERNAL_ERROR: {
        code: 500,
        message: "Internal error occured, please try again"
    },
    USER_NOT_FOUND: {
       code: 404,
       message: "User is not found"
    },
    NOT_FOUND: {
        code: 404,
        message: "Resource requested is not found"
    },
    BAD_REQUEST: {
        code: 400,
        message: "Params is not correct"
    },
    loginType: {
        SSO: "SSO",
        GOOGLE: "GOOGLE"
    },
    userSSORole: {
        MAHASISWA: "mahasiswa",
        STAFF: "staff"
    },
    awsS3: {
        BUCKET_NAME: "konselink",
        REGION: "ap-southeast-1",
        API_VERSION: '2006-03-01',
        EXPIRES:  86400
    },
    DEFAULT_ENTRY_SIZE: 30,
    DEFAULT_PAGE_NO: 1,
    ADMIN_ID: 9,
    KONSELINK_BACKEND_ID: 0,
    KONSELINK_WS_URL: process.env.KONSELINK_WS_URL || "http://localhost:5000",
    WS_CONNECT_TIMEOUT: 1000,
    WS_EMIT_TIMEOUT: 500,
    nofiticationType: {
        APPROVAL: "APPROVAL",
        REJECTION: "REJECTION",
        REQUEST: "REQUEST"
    },
    questionType: {
        SRQ: "SRQ",
        IPIP: "IPIP"
    },
    SCHOOL_DATA_KEY: ["collegeData", "kindergartenData", "seniorData", "juniorData", "elementaryData"]
};