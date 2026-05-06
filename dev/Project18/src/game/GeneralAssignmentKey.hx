package game;

/**
 * 通用：指派武將行為的「可擴充識別碼」。
 *
 * 為避免領域層（game）必須隨每個 ver/內容擴充去新增 enum case，
 * 此處用字串 key 作為穩定介面；各實作（如 impl_ver1）可集中定義其 keys 常數。
 */
typedef GeneralAssignmentKey = String;

