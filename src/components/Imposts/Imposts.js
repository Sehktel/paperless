import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import {withIface} from 'metadata-redux';
import Builder from '../Builder';
import Props from '../Props/Main';
import withStyles, {WorkPlace, WorkPlaceFrame} from '../App/WorkPlace';

class Imposts extends WorkPlace {

  barcodeFin(bar) {
    const {state: {full_picture}, editor: {project}} = this;
    const {cnstr, ox} = bar;
    project.load(ox, {auto_lines: full_picture, custom_lines: full_picture, mosquito: full_picture})
      .then(() => {
        if(full_picture) {
          return;
        }

        const contour = project.getItem({cnstr});
        if(contour) {
          // рисуем текущий слой
          project.draw_fragment({elm: -cnstr});
          // прячем заполнения
          contour.glasses(true);
          // рисуем спецразмеры импостов
          contour.l_dimensions.draw_by_imposts();
          // подкрашиваем штульпы
          this.editor.color_shtulps(contour);
          // вписываем в размер экрана
          project.zoom_fit();
          this.setState(bar);
        }
      });
  }

  render() {
    const {state: {full_picture}, props: {classes}} = this;
    return <WorkPlaceFrame>
      <Grid item sm={12} md={full_picture ? 9 : 8} className={classes.workplace}>
        <Builder registerChild={this.registerEditor}/>
      </Grid>
      <Grid item sm={12} md={full_picture ? 3 : 4} className={classes.props}>
        <Props {...this.state} show_spec={false} changeFull={this.changeFull}/>
      </Grid>
    </WorkPlaceFrame>;
  }
}

Imposts.propTypes = {
  handleIfaceState: PropTypes.func.isRequired,
  title: PropTypes.string,
  classes: PropTypes.object.isRequired,
};

export default withStyles(withIface(Imposts));
