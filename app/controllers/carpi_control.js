var CarpiControl = function () {
  this.index = function (req, resp, params) {
    this.respond({params: params}, {
      format: 'html'
    , template: 'app/views/carpi_control/index'
    });
  };
};

exports.CarpiControl = CarpiControl;
