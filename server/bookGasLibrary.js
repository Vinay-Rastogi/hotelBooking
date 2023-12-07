async function bookGas(email, address, GasBooking) {
  try {
    // Check if the user has booked within the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const existingBooking = await GasBooking.findOne({
      email,
      bookingDate: { $gte: sevenDaysAgo.toISOString() },
    });

    if (existingBooking) {
      throw new Error('Cannot book Hotel within 7 days of the previous booking.');
    }

    // Proceed with the booking
    const bookingDate = new Date().toISOString();
    const booking = new GasBooking({
      bookingDate,
      email,
      address,
    });

    await booking.save();

    return 'Hotel booking created successfully!';
  } catch (error) {
    console.error(error);
    throw new Error('Failed to book Hotel. ' + error.message);
  }
}


async function recentBooking(email, GasBooking) {
  try {
    const booking = await GasBooking.findOne({ email }).sort({ bookingDate: -1 });

    if (booking) {
      return booking;
    } else {
      return null;
    }
  } catch (error) {
    console.error(error);
    throw new Error('Failed to retrieve recent booking. ' + error.message);
  }
}

async function cancelBooking(email, GasBooking) {
  try {
    // Find the latest booking for the specified email
    const latestBooking = await GasBooking.findOne({ email }).sort({ bookingDate: -1 });

    // Check if there is a booking to cancel
    if (!latestBooking) {
      throw new Error('No booking found to cancel.');
    }

    // Check if the booking is within the last 24 hours
    const currentDateTime = new Date();
    const bookingDateTime = new Date(latestBooking.bookingDate);
    const hoursDifference = Math.abs(currentDateTime - bookingDateTime) / 36e5;

    if (hoursDifference > 24) {
      throw new Error('Cannot cancel a booking after 24 hours of booking date-time.');
    }

    // Proceed with cancellation
    await GasBooking.deleteOne({ _id: latestBooking._id });

    return 'Booking canceled successfully!';
  } catch (error) {
    console.error(error);
    throw new Error('Failed to cancel booking. ' + error.message);
  }
}

async function updateAddress(email, GasBooking, newAddress) {
  try {
    console.log(newAddress);
    const latestBooking = await GasBooking.findOne({ email }).sort({ bookingDate: -1 });
    console.log('Latest Booking:', latestBooking);

    if (!latestBooking) {
      throw new Error('No booking found to edit Address.');
    }

    const currentDateTime = new Date();
    const bookingDateTime = new Date(latestBooking.bookingDate);
    const hoursDifference = Math.abs(currentDateTime - bookingDateTime) / 36e5;

    if (hoursDifference > 24) {
      throw new Error('Cannot edit booking hotel after 24 hours of booking date-time.');
    }

    console.log('Updating Address to:', newAddress);

    await GasBooking.updateOne(
      { _id: latestBooking._id },
      { $set: { address: newAddress } }
    );

    console.log('Dated Updated successfully!');
    return 'Dated Updated successfully!';
  } catch (error) {
    console.error('Error:', error);
    throw new Error('Failed to edit address ' + error.message);
  }
}


async function viewAllBookings(email, GasBooking) {
  try {
    const userBookings = await GasBooking.find({ email });

    return userBookings;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to retrieve user bookings. ' + error.message);
  }
}





module.exports = {
  bookGas,
  recentBooking,
  cancelBooking,
  viewAllBookings,
  updateAddress
};
