addIsAdminColumn();
function addIsAdminColumn() {
	`alter table users add column is_admin BOOLEAN DEFAULT false`; // added same in users table definition in the use_db_service.js
}
