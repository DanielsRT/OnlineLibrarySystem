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

CREATE TABLE Catalog (
	accession VARCHAR(25) PRIMARY KEY,
	title VARCHAR(255) NOT NULL,
	author VARCHAR(255) NOT NULL,
	date DATE NOT NULL,
	type VARCHAR(25) NOT NULL,
	publisher VARCHAR(255),
	isbn VARCHAR(255),
	doi VARCHAR(255)
);

CREATE TABLE Loans (
	accession VARCHAR(25) PRIMARY KEY,
	checkout_date DATE NOT NULL,
	return_date DATE NOT NULL,
	user_id INT,
	FOREIGN KEY (accession) REFERENCES Catalog(accession),
	FOREIGN KEY (user_id) REFERENCES Users(user_id)
)

CREATE TABLE Transactions (
	transaction_id INT AUTO_INCREMENT PRIMARY KEY,
	date DATE NOT NULL,
	accession VARCHAR(25),
	user_id INT NOT NULL,
    FOREIGN KEY (accession) REFERENCES Catalog(accession),
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

INSERT INTO Users (username, password, last_name, first_name, isAdmin) VALUES 
('admin','password123','Doe','John',true),
('turtle3','password345','Turtle','Frank',false),
('otter5','password567','Otter','Steve',false),
('lucky7','password789','Lucky','Timmy',false),
('rocky9','password910','Rocky','Jim',false),
('purple1','password101','Purple','Alvin',false);

-- Add Books
INSERT INTO Catalog VALUES 
(2022.1,'To Kill a BlueJay','Mary Anthea','1964-02-01','Book','Jones Publishing','972-1-4013-9462-6',null),
(2022.2,'How To Code for Fools','Larry Bert','2002-04-02','Book','Eden','172-1-4313-9422-2',null),
(2022.3,"Baby's First Microprocessor",'Daniel Craig','2006-09-01','Book','Eden','462-2-1113-4452-4',null),
(2023.1,'1994','Tom Orpoor','1990-03-21','Book','Dale Publishing','922-1-1014-8412-6',null),
(2023.2,'Everybody Loops','Kim Maryland','2018-05-11','Book','Cubular','713-5-6211-4161-3',null),
(2023.3,'Stroad to Purgatory','Jerry Lewis','2010-12-01','Book','Cubular','172-1-3053-7864-6',null);

-- Add News Articles
INSERT INTO Catalog VALUES
(2022.4,'Local Man Saves Baby','Scott Turner','2021-11-21','News Article','Jackal News',null,"10.2131/jackal.12081"),
(2022.5,"Cat's Head Stuck in Jar",'Samantha Goodall','2019-03-14','News Article','GNN',null,"10.1937/gnn.19374"),
(2022.6,"2,300 Doorknobs Recalled",'Jessica Antwon','2018-07-09','News Article','Jackal News',null,"10.3048/jackal.19378"),
(2023.4,"Candle Factory Burns Down",'Albert Edire','2019-04-24','News Article','GNN',null,"10.8493/gnn.97234"),
(2023.5,"The Ongoing Jello Shortage",'Kevin Gorgo','2018-06-11','News Article','Jackal News',null,"10.1048/jackal.83729"),
(2023.6,"Dog Stuck in Large Tree",'Samantha Goodall','2020-01-06','News Article','GNN',null,"10.3859/gnn.19048");

-- Add Scholarly Articles
INSERT INTO Catalog VALUES
(2022.7,'The Secret to Pig Flight','Tommy Halworth','2022-01-20','Scholarly Article','Metaphoro',null,"10.1238/phoro.75931"),
(2022.8,"Coorelation Between Water and Hydration",'Frieda Fredricks','2021-05-15','Scholarly Article','Science Weekly',null,"10.7392/science.74921"),
(2022.9,"Why Fire is Hot",'Lisa Barnette','2019-08-19','Scholarly Article','Life',null,"10.6293/life.17491"),
(2023.7,"Research on Human Hearing",'Bill Dalian','2022-10-28','Scholarly Article','BioFuture',null,"10.6152/biof.16592"),
(2023.8,"Average Cuteness of Dog Breeds",'Tommy Halworth','2022-06-13','Scholarly Article','veterinarian Society',null,"10.4691/vetsoc.16759"),
(2023.9,"Designing a Time Machine",'Gretchen Sawyer','2130-02-06','Scholarly Article','Science Weekly',null,"10.7493/science.90141");
    
-- Add Transactions
INSERT INTO Transactions (date, accession, user_id) VALUES 
('2022-09-23','2022.3',2),
('2022-10-12','2022.5',2),
('2022-12-01','2022.6',2),
('2023-02-09','2023.2',2),
('2023-04-14','2023.9',2),
('2022-12-09','2022.1',3),
('2023-03-11','2023.3',3),
('2022-11-19','2022.6',4),
('2023-04-24','2023.7',4),
('2022-10-21','2022.2',5),
('2023-07-13','2023.3',5),
('2022-05-01','2022.4',6),
('2023-02-10','2023.4',6);

