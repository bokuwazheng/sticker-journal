INSERT INTO sender
	(user_id, first_name, last_name, username, is_banned, chat_id, notify)
	VALUES 
	(1337, 'j3ff', NULL, null, false, 1337, true);

INSERT INTO suggestion
	(file_id, made_at, user_id)
	VALUES 
	('f4k3', CURRENT_TIMESTAMP, 1337);

INSERT INTO review
	(suggestion_id, user_id, submitted_at, result_code)
	VALUES 
	(1, 1337, CURRENT_TIMESTAMP, 20);