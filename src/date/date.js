import React from 'react';

export function Date() {
    let date = new Date();
    console.log(date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear());
}

export function YearDate() {
    let date = new Date();
    console.log(date.getFullYear() + 1 + '-' + date.getMonth() + '/' + date.date());
}
