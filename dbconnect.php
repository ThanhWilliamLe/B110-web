<?php

$host = "stampy.db.elephantsql.com";
$user = "virecnti";
$pass = "ipMZgV1SwYP-S1eyDZ057WDb2xAo9dn5";
$db = "virecnti";

// Open a PostgreSQL connection
$con = pg_connect("host=$host dbname=$db user=$user password=$pass")
or die ("Could not connect to server\n");

$query = urldecode($_GET['query']);
$results = pg_query($con, "select * from people") or die('Query failed: ' . pg_last_error());

$row = pg_fetch_row($results);
echo implode(",", $row);
// Closing connection
pg_close($con);
