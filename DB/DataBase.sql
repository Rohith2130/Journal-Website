create database myDiary;
use myDiary;

create table Users(
EmailID varchar(50) unique,
HashedPassword varchar(100),
ID int primary key auto_increment
);

insert into Users(EmailID,HashedPassword) values('rohith','sample');
select * from Users;

create table Posts(
ID int primary key auto_increment,
UserID int,
postTitle varchar(100),
postDescription varchar(1500),
foreign key (UserID) references Users(ID)
);
insert into Posts(UserID,postTitle,postDescription)
 values(1,"Day at clg","it was good");
