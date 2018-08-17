<?php

use Faker\Generator as Faker;

$factory->define(App\Message::class, function (Faker $faker) {
    return [
        'body' => $faker->realText($maxNbChars = 200, $indexSize = 2)
    ];
});
