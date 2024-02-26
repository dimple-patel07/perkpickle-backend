addCardDetailColumn();
function addCardDetailColumn() {
	`alter table cards add column card_detail JSON`; // added same in users table definition in the use_db_service.js
}
