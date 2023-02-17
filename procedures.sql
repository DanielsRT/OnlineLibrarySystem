DELIMITER //
CREATE PROCEDURE create_books_table()
BEGIN
	CREATE TEMPORARY TABLE Books 
	SELECT accession, title, author, date, publisher, isbn FROM Catalog
	WHERE type = 'Book';
END//
    
DELIMITER //
CREATE PROCEDURE create_news_table()
BEGIN
	CREATE TEMPORARY TABLE Books 
	SELECT accession, title, author, date, publisher, doi FROM Catalog
	WHERE type = 'News Article';
END//

DELIMITER //
CREATE PROCEDURE create_scholarly_table()
BEGIN
	CREATE TEMPORARY TABLE Books 
	SELECT accession, title, author, date, publisher, doi FROM Catalog
	WHERE type = 'Scholarly Article';
END//