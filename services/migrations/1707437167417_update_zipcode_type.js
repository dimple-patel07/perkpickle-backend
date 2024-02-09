changeZipcodeType();
function changeZipcodeType() {
	`alter table users alter column zip_code type VARCHAR(255)`; // added same in users table definition in the use_db_service.js
}
