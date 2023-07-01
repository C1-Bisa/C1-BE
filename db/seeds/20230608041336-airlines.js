"use strict";

/** @type {import('sequelize-cli').Migration} */

const airlines = [
    {
        airline_code: "IU",
        airline_name: "Super Air Jet",
        image: "https://i.imgur.com/T2FiwgE.png",   
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        airline_code: "GA",
        airline_name: "Garuda Indonesia",
        image: "https://i.imgur.com/fT4vBdP.png",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        airline_code: "ID",
        airline_name: "Batik Air",
        image: "https://i.imgur.com/SqLG3i1.png",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        airline_code: "QG",
        airline_name: "Citilink",
        image:"https://i.imgur.com/kXwPrOR.png",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        airline_code: "AK",
        airline_name: "Air Asia",
        image: "https://i.imgur.com/11kHCNz.png",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        airline_code: "JT",
        airline_name: "Lion Air",
        image: "https://i.imgur.com/jx9jkTs.png",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        airline_code: "SJ",
        airline_name: "Sriwijaya Air",
        image: "https://i.imgur.com/v4W6Mhe.png",
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
         * await queryInterface.bulkInsert('People', [{
         *   name: 'John Doe',
         *   isBetaMember: false
         * }], {});
         * 
         * id: 
airline_code
airline_name
createdAt
updatedAt
         */
        await queryInterface.bulkInsert("Airlines", airlines, {});
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         */
        await queryInterface.bulkDelete("Airlines", null, {});
    },
};
