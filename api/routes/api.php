<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redis;

use App\Message;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

const APP_MESSAGES_CACHE_SIZE = 100;
const APP_ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
const APP_ALLOWED_VIDEO_TYPES = ['video/ogg', 'video/webm', 'video/mp4'];

function addToRedis($message) {
    Redis::zadd('messages', $message->id, $message);
    Redis::zremrangebyscore(
        'messages',
        '-inf',
        $message->id - APP_MESSAGES_CACHE_SIZE
    );
}

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/join', function (Request $request) {
    // Not a real authentication. Just return the last message id.
    $username = $request->query('username');
    $lastMessage = Message::orderBy('id', 'desc')->first();
    $lastMessageId = $lastMessage != null ? $lastMessage->id : 0;
    return [ 'lastMessageId' => $lastMessageId ];
});

// Get messages with id greater than the id passed in the request
Route::get('/messages', function (Request $request) {
    $lastClientId = intval($request->query('id'));
    function decode($message) {
        return json_decode($message, true);
    }
    $messages = array_map(
        'decode',
        Redis::zrangebyscore('messages', '('.$lastClientId, '+inf')
    );
    return count($messages) == 0 ? [
        'change' => false,
    ] : [
        'change' => true,
        'lastId' => array_slice($messages, -1)[0]['id'],
        'messages' => $messages
    ];
});

// Save a new message in the database and redis
Route::post('/messages', function (Request $request) {
    $message = new Message();
    $message->body = $request->message;
    $message->image = '';
    $message->video = '';
    $message->save();
    addToRedis($message);
    return $message;
});

// Store uploaded image and create a new message showing it
Route::post('/images', function (Request $request) {
    $request->validate([
        'file' => 'file|mimetypes:' . implode(',', APP_ALLOWED_IMAGE_TYPES)
    ]);
    $path = $request->file('file')->store('images', 'public');
    $message = new Message();
    $message->body = '';
    $message->image = $path;
    $message->video = '';
    $message->save();
    addToRedis($message);
    return $message;
});

// Store uploaded video and create a new message showing it
Route::post('/videos', function (Request $request) {
    $request->validate([
        'file' => 'file|mimetypes:' . implode(',', APP_ALLOWED_VIDEO_TYPES)
    ]);
    $path = $request->file('file')->store('videos', 'public');
    $message = new Message();
    $message->body = '';
    $message->image = '';
    $message->video = $path;
    $message->save();
    addToRedis($message);
    return $message;
});
