class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryOpb = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryOpb[el]);

    //advanced filtering  //http://127.0.0.1:3000/api/v1/tours?duartion[age]=5
    let queryStr = JSON.stringify(queryOpb);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    //sorting  //http://127.0.0.1:3000/api/v1/tours?sort=name,duartion
    if (this.queryString?.sort) {
      this.query = this.query.sort(this.queryString?.sort.split(',').join(' '));
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }
  limit() {
    //field limiting   //http://127.0.0.1:3000/api/v1/tours?fileds=name,duartion
    if (this.queryString?.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }
  pagination() {
    // pagination
    const page = this.queryString.page * 1 || 1; // change to number
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}
module.exports = APIFeatures;
