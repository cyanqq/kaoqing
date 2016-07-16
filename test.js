documnet1 = {
    title: 'PHP',
    description: 'phpphp',
    by: 'cyan',
    url: 'www.aaa.com',
    by: '[php]',
    likes: 200,
}

documnet2 = {
    title: 'java',
    description: 'javajava',
    by: 'cyan',
    url: 'www.aaa.com',
    by: '[java]',
    likes: 150,
}

documnet3 = {
    title: 'mongodb',
    description: 'mongoose',
    by: 'cyan',
    url: 'www.aaa.com',
    by: '[mongodb]',
    likes: 100,
}

db.col.aggregate([
    {$match:{score:{$gt:70}}},
    {$group:{_id:null,count:{$sum:1}}}
])