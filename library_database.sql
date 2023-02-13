create database library_database;
use library_database;

CREATE TABLE Users (
	user_id INT AUTO_INCREMENT PRIMARY KEY,
	phone INT,
	email VARCHAR(25),
	username VARCHAR(25) NOT NULL,
	password VARCHAR(25) NOT NULL,
	last_name VARCHAR(25),
	first_name VARCHAR(25),
	isAdmin BOOLEAN NOT NULL
);

INSERT INTO Users (username, password, last_name, first_name, isAdmin) VALUES 
('admin','password123','Doe','John',true),
('turtle3','password345','Turtle','Frank',false),
('otter5','password567','Otter','Steve',false),
('lucky7','password789','Lucky','Timmy',false),
('rocky9','password910','Rocky','Jim',false),
('purple1','password101','Purple','Alvin',false);

CREATE TABLE Catalog (
	accession FLOAT PRIMARY KEY,
	title VARCHAR(255) NOT NULL,
	author VARCHAR(255) NOT NULL,
	date DATE NOT NULL,
	type VARCHAR(25) NOT NULL,
	publisher VARCHAR(255),
	isbn VARCHAR(255),
	doi VARCHAR(255)
);

CREATE TABLE Books 
	SELECT * FROM Catalog
	WHERE type = 'Book';
    
CREATE TABLE NewsArticles 
	SELECT * FROM Catalog
	WHERE type = 'News Article';


CREATE TABLE ScholarlyArticles 
	SELECT * FROM Catalog
	WHERE type = 'Scholarly Article';
    
CREATE TABLE Transactions (
	transaction_id INT AUTO_INCREMENT PRIMARY KEY,
	date DATE NOT NULL,
	accession FLOAT,
	user_id INT,
    FOREIGN KEY (accession) REFERENCES Catalog(accession),
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

