addIsSignupColumn();
function addIsSignupColumn() {
	`alter table users add column is_signup_completed BOOLEAN DEFAULT false`; // added same in users table definition in the use_db_service.js
}
