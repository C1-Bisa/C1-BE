'use strict';

const { format } = require('morgan');

/** @type {import('sequelize-cli').Migration} */

const flight = [
  {
    airline_id: 3,
    airport_id_from: 1,
    airport_id_to: 6,
    departure_date: "2023-06-22",
    departure_time: "08:00",
    arrival_date: "2023-06-22",
    arrival_time: "11:00",
    from: "Jakarta",
    to: "Bali",
    duration: 3,
    price: 2000000,
    flight_class: "Bussiness",
    description: "Baggage 20 kg Cabin baggage 7 kg In Flight Entertainment ",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    airline_id: 3,
    airport_id_from: 1,
    airport_id_to: 6,
    departure_date: "2023-06-22",
    departure_time: "09:00",
    arrival_date: "2023-06-22",
    arrival_time: "12:00",
    from: "Jakarta",
    to: "Bali",
    duration: 3,
    price: 2000000,
    flight_class: "Bussiness",
    description: "Baggage 20 kg Cabin baggage 7 kg In Flight Entertainment ",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    airline_id: 5,
    airport_id_from: 1,
    airport_id_to: 6,
    departure_date: "2023-06-23",
    departure_time: "10:00",
    arrival_date: "2023-06-23",
    arrival_time: "13:00",
    from: "Jakarta",
    to: "Bali",
    duration: 3,
    price: 2000000,
    flight_class: "Bussiness",
    description: "Baggage 20 kg Cabin baggage 7 kg In Flight Entertainment ",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    airline_id: 5,
    airport_id_from: 6,
    airport_id_to: 1,
    departure_date: "2023-06-26",
    departure_time: "08:00",
    arrival_date: "2023-06-26",
    arrival_time: "11:00",
    from: "Bali",
    to: "Jakarta",
    price: 2000000,
    duration: 3,
    flight_class: "Economy",
    description: "Baggage 10 kg Cabin baggage 6 kg In Flight Entertainment ",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    airline_id: 5,
    airport_id_from: 6,
    airport_id_to: 1,
    departure_date: "2023-06-26",
    departure_time: "08:00",
    arrival_date: "2023-06-26",
    arrival_time: "11:00",
    from: "Bali",
    to: "Jakarta",
    duration: 3,
    price: 5000000,
    flight_class: "Bussiness",
    description: "Baggage 20 kg Cabin baggage 7 kg In Flight Entertainment ",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    airline_id: 5,
    airport_id_from: 6,
    airport_id_to: 1,
    departure_date: "2023-06-27",
    departure_time: "08:00",
    arrival_date: "2023-06-27",
    arrival_time: "11:00",
    from: "Bali",
    to: "Jakarta",
    duration: 3,
    price: 5000000,
    flight_class: "Bussiness",
    description: "Baggage 20 kg Cabin baggage 7 kg In Flight Entertainment ",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    airline_id: 5,
    airport_id_from: 6,
    airport_id_to: 1,
    departure_date: "2023-06-27",
    departure_time: "08:00",
    arrival_date: "2023-06-27",
    arrival_time: "11:00",
    from: "Bali",
    to: "Jakarta",
    duration: 3,
    price: 2000000,
    flight_class: "Economy",
    description: "Baggage 10 kg Cabin baggage 7 kg In Flight Entertainment ",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    airline_id: 5,
    airport_id_from: 6,
    airport_id_to: 1,
    departure_date: "2023-06-27",
    departure_time: "10:00",
    arrival_date: "2023-06-27",
    arrival_time: "13:00",
    from: "Bali",
    to: "Jakarta",
    duration: 3,
    price: 2000000,
    flight_class: "Economy",
    description: "Baggage 10 kg Cabin baggage 7 kg In Flight Entertainment ",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    airline_id: 5,
    airport_id_from: 3,
    airport_id_to: 6,
    departure_date: "2023-06-23",
    departure_time: "08:00",
    arrival_date: "2023-06-23",
    arrival_time: "11:00",
    from: "Medan",
    to: "Bali",
    duration: 3,
    price: 2000000,
    flight_class: "Economy",
    description: "Baggage 10 kg Cabin baggage 7 kg In Flight Entertainment ",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    airline_id: 5,
    airport_id_from: 3,
    airport_id_to: 6,
    departure_date: "2023-06-23",
    departure_time: "08:00",
    arrival_date: "2023-06-23",
    arrival_time: "11:00",
    from: "Medan",
    to: "Bali",
    duration: 3,
    price: 5000000,
    flight_class: "Bussiness",
    description: "Baggage 20 kg Cabin baggage 7 kg In Flight Entertainment ",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    airline_id: 5,
    airport_id_from: 3,
    airport_id_to: 6,
    departure_date: "2023-06-24",
    departure_time: "08:00",
    arrival_date: "2023-06-24",
    arrival_time: "11:00",
    from: "Medan",
    to: "Bali",
    duration: 3,
    price: 5000000,
    flight_class: "Bussiness",
    description: "Baggage 20 kg Cabin baggage 7 kg In Flight Entertainment ",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    airline_id: 5,
    airport_id_from: 6,
    airport_id_to: 7,
    departure_date: "2023-06-24",
    departure_time: "08:00",
    arrival_date: "2023-06-24",
    arrival_time: "11:00",
    from: "Bali",
    to: "Surabaya",
    duration: 3,
    price: 5000000,
    flight_class: "Bussiness",
    description: "Baggage 20 kg Cabin baggage 7 kg In Flight Entertainment ",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    airline_id: 5,
    airport_id_from: 6,
    airport_id_to: 7,
    departure_date: "2023-06-25",
    departure_time: "08:00",
    arrival_date: "2023-06-25",
    arrival_time: "11:00",
    from: "Bali",
    to: "Surabaya",
    duration: 3,
    price: 5000000,
    flight_class: "Bussiness",
    description: "Baggage 20 kg Cabin baggage 7 kg In Flight Entertainment ",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    airline_id: 5,
    airport_id_from: 6,
    airport_id_to: 7,
    departure_date: "2023-06-24",
    departure_time: "08:00",
    arrival_date: "2023-06-24",
    arrival_time: "11:00",
    from: "Bali",
    to: "Surabaya",
    duration: 3,
    price: 5000000,
    flight_class: "Bussiness",
    description: "Baggage 20 kg Cabin baggage 7 kg In Flight Entertainment ",
    createdAt: new Date(),
    updatedAt: new Date()
  },

];


module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert("Flights", flight, {});

  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
    */
    await queryInterface.bulkDelete("Flights", null, {});
  }
};
