<?php

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$storageFile = __DIR__ . '/koscher-leaderboard.json';
$maxEntries = 5;
$maxNameLength = 20;

function trimName(string $name, int $maxLength): string
{
    if (function_exists('mb_substr')) {
        return mb_substr($name, 0, $maxLength);
    }

    return substr($name, 0, $maxLength);
}

function normalizeNameKey(string $name): string
{
    if (function_exists('mb_strtolower')) {
        return mb_strtolower($name, 'UTF-8');
    }

    return strtolower($name);
}

function readScores(string $storageFile): array
{
    if (!file_exists($storageFile)) {
        return [];
    }

    $content = file_get_contents($storageFile);
    if ($content === false || trim($content) === '') {
        return [];
    }

    $decoded = json_decode($content, true);
    if (!is_array($decoded)) {
        return [];
    }

    $validScores = [];

    foreach ($decoded as $entry) {
        if (!is_array($entry)) {
            continue;
        }

        $name = isset($entry['name']) && is_string($entry['name']) ? trim($entry['name']) : 'Anonym';
        $score = isset($entry['score']) ? (int)$entry['score'] : null;

        if ($score === null || $score < 0) {
            continue;
        }

        $validScores[] = [
            'name' => $name !== '' ? trimName($name, 20) : 'Anonym',
            'score' => $score,
        ];
    }

    return $validScores;
}

function normalizeScores(array $scores, int $maxEntries): array
{
    $bestByName = [];

    foreach ($scores as $entry) {
        $name = $entry['name'];
        $score = (int)$entry['score'];
        $key = normalizeNameKey($name);

        if (!isset($bestByName[$key]) || $score > $bestByName[$key]['score']) {
            $bestByName[$key] = [
                'name' => $name,
                'score' => $score,
            ];
        }
    }

    $normalized = array_values($bestByName);

    usort(
        $normalized,
        static fn(array $a, array $b): int => $b['score'] <=> $a['score']
    );

    return array_slice($normalized, 0, $maxEntries);
}

function writeScores(string $storageFile, array $scores): bool
{
    $encoded = json_encode($scores, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

    if ($encoded === false) {
        return false;
    }

    return file_put_contents($storageFile, $encoded . PHP_EOL, LOCK_EX) !== false;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    echo json_encode(['entries' => normalizeScores(readScores($storageFile), $maxEntries)], JSON_UNESCAPED_UNICODE);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Methode nicht erlaubt'], JSON_UNESCAPED_UNICODE);
    exit;
}

$rawBody = file_get_contents('php://input');
$payload = json_decode($rawBody ?: '', true);

if (!is_array($payload)) {
    http_response_code(400);
    echo json_encode(['error' => 'Ungültiger Request-Body'], JSON_UNESCAPED_UNICODE);
    exit;
}

$name = isset($payload['name']) && is_string($payload['name']) ? trim($payload['name']) : 'Anonym';
$score = isset($payload['score']) ? (int)$payload['score'] : null;

if ($score === null || $score < 0) {
    http_response_code(422);
    echo json_encode(['error' => 'Ungültiger Score'], JSON_UNESCAPED_UNICODE);
    exit;
}

$cleanName = $name !== '' ? trimName($name, $maxNameLength) : 'Anonym';
$current = readScores($storageFile);
$current[] = ['name' => $cleanName, 'score' => $score];
$normalized = normalizeScores($current, $maxEntries);

if (!writeScores($storageFile, $normalized)) {
    http_response_code(500);
    echo json_encode(['error' => 'Bestenliste konnte nicht gespeichert werden'], JSON_UNESCAPED_UNICODE);
    exit;
}

echo json_encode(['entries' => $normalized], JSON_UNESCAPED_UNICODE);
