"use strict";

/** @type {import('sequelize-cli').Migration} */

const airports = [
    {
        airport_code: "CGK",
        airport_name: "Soekarno-Hatta",
        airport_location: "Jakarta",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        airport_code: "HLM",
        airport_name: "Halim Perdanakusuma",
        airport_location: "Jakarta",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        airport_code: "KNO",
        airport_name: "Kualanamu",
        airport_location: "Medan",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        airport_code: "JOG",
        airport_name: "Adisutjipto",
        airport_location: "Yogyakarta",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        airport_code: "SRG",
        airport_name: "Ahmad Yani",
        airport_location: "Semarang",
        createdAt: new Date(),
        updatedAt: new Date(),
    },

    {
        airport_code: "DPS",
        airport_name: "Ngurah Rai",
        airport_location: "Bali",
        createdAt: new Date(),
        updatedAt: new Date(),
    },

    {
        airport_code: "SUB",
        airport_name: "Juanda",
        airport_location: "Surabaya",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        airport_code: "PNK",
        airport_name: "Supadio",
        airport_location: "Pontianak",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
];

module.exports = {
    async up(queryInterface, Sequelize) {
        /**
         * Add seed commands here.
         *
         * Example:
         * await queryInterface.bulkInsert('Airports', [{
         *   name: 'John Doe',
         *   isBetaMember: false
         * }], {});
         */

        await queryInterface.bulkInsert("Airports", airports, {});
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         */
        await queryInterface.bulkDelete("Airports", null, {});
    },
};
