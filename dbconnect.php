<?php
include 'ChromePhp.php';

$host = "stampy.db.elephantsql.com";
$user = "virecnti";
$pass = "ipMZgV1SwYP-S1eyDZ057WDb2xAo9dn5";
$db = "virecnti";

// Open a PostgreSQL connection
$con = pg_connect("host=$host dbname=$db user=$user password=$pass")
or die ("Could not connect to server\n");

$query = urldecode($_GET['query']);
$results = pg_query($con, $query) or die('Query failed: ' . pg_last_error());

$rows = [];

while ($row = pg_fetch_row($results))
{
    $rowString = implode("|", $row);
    array_push($rows, $rowString);
}

pg_close($con);

$finalResult = implode("#&#", $rows);

$saveFileName = $_GET['savename'];
$saveFile = fopen($saveFileName, 'w');
fwrite($saveFile, $finalResult);
fclose($saveFile);

echo $finalResult;
