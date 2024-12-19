<?php
$host = 'localhost';
$dbname = 'mindsound';
$username = 'root'; // Cambia con il tuo username del database
$password = ''; // Cambia con la tua password

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (isset($_POST['action']) && $_POST['action'] == 'save_score') {
        $score = $_POST['score'];
        $stmt = $pdo->prepare("INSERT INTO scores (score) VALUES (:score)");
        $stmt->bindParam(':score', $score);
        $stmt->execute();
        echo "Score saved!";
    }
}
?>
