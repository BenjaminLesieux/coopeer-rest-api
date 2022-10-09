'use strict'

const { test } = require('tap')
const { build } = require('../helper')

test('default user auth route', async (t) => {
    const app = await build(t)

    const res = await app.inject({
        url: 'http://127.0.0.1:3000/api/auth/login',
        method: "POST",
        body: {
            "email":"benjamin.lesieux@efrei.net",
            "password":"Benlesieux6",
        }
    })

    const json = JSON.parse(res.payload);

    console.log(json);

    t.same(json.user, {
        "_id": "6342d5efd88b15567bc304a3",
        "name": "Lesieux",
        "surname": "Benjamin",
        "email": "benjamin.lesieux@efrei.net",
        "password": "$2a$10$R1Jd5hcrkjIXdA0xxntXc.6hmRQcaFJpH6wU8qV6SP.ySd7BlB/aW",
        "learningXP": 0,
        "__v": 0,
    });
})