<?php
include "ChromePHP.php";

$host = "sql12.freemysqlhosting.net";
$user = "sql12244652";
$pass = "A5BJwArrhk";
$db = "sql12244652";

// Open a MySQL connection
$con = new mysqli($host, $user, $pass, $db);
mysqli_set_charset($con, 'UTF8');
if ($con->connect_error)
{
	die("Connection failed: " . $con->connect_error);
}

$query = urldecode($_GET['query']);
$results = $con->query($query);

$rows = [];

if ($results->num_rows > 0)
{
	while ($row = $results->fetch_assoc())
	{
		$rowString = implode("|", $row);
		array_push($rows, $rowString);
	}
}
$con->close();

$finalResult = implode("#&#", $rows);
echo $finalResult;

$saveFileName = $_GET['savename'];
if($saveFileName!="DONTSAVE")
{
	$saveFile = fopen($saveFileName, 'w');
	fwrite($saveFile, $finalResult);
	fclose($saveFile);
}
