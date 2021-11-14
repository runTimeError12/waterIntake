var Sequelize = require('sequelize');
const Op = Sequelize.Op;
const models = require("../../models/db");
const conn = require("../../config/conn");
const helper = require('../../helpers/util');
const log = require('../../helpers/logger');
const { imageUpload } = require("../../helpers/file-upload");
const sequelize = conn;

exports.addWaterSettings = async (req, res, next) => {
    console.log("addWaterSettings")
    // var userID = helper.getIdFromToken(req.headers['authorization']);
    var userID=req.body.userID;
    try {
        const waterSettings = {
            userID:Number(userID),
            isDefault:Boolean(req.body.isDefault),
            dailyGoals:Number(req.body.dailyGoals),
            cupSize:Number(req.body.cupSize),
            waterReminder:Boolean(req.body.waterReminder),
            timeInterval:Number(req.body.timeInterval),
            start:req.body.start,
            end:req.body.end,
            createdByUserID:Number(userID),
            lastUpdatedUserID:Number(userID),
            isActive:1
        }
        console.log(waterSettings);
        models.waterSettings.create(waterSettings)
            .then(waterSettings => {
                res.send({
                    status: 200,
                    data: waterSettings,
                    message: "WaterSettings added succsessfully!"
                })
            })
            .catch(err => {
                res.send({
                    status: 400,
                    message: "Error occured while adding WaterSettings!"
                })
                console.log("Req, ", err );
            })
    }
    catch (e) {
        next(e);
    }

}

exports.getWaterSettings = async(req, res, next) =>{
    try{
      // var userID = helper.getIdFromToken(req.headers['authorization']);
      let {userID}=req.query;
      let querystring = `select waterSettingsID,isDefault,dailyGoals,cupSize,waterReminder,timeInterval,[start],[end],isActive,createdAt,updatedAt,userID,createdByUserID,lastUpdatedUserID from waterSettings where userID=${userID} and isActive=1`;

          sequelize
                  .query(querystring, {
                    replacements: { },
                    type: sequelize.QueryTypes.SELECT
                  })
                  .then(waterSettings => {
                    if(waterSettings.length==0)
                    {
                      let defaultQuerystring = `select waterSettingsID,isDefault,dailyGoals,cupSize,waterReminder,timeInterval,[start],[end],isActive,createdAt,updatedAt,userID,createdByUserID,lastUpdatedUserID from waterSettings where isDefault=1 and isActive=1`;
                      sequelize
                      .query(defaultQuerystring, {
                        replacements: { },
                        type: sequelize.QueryTypes.SELECT
                      })
                      .then(defaultWaterSettings => {
                        res.send({
                          status: 200,
                          data: defaultWaterSettings,
                          message:"water default Settings found successfully"
                        });
                      })
                      
                      .catch(err => next(err));
                  }
                  else{
                    res.send({
                      status: 200,
                      data: waterSettings,
                      message:"waterSettings found successfully"
                    });
                  }
                  })
                  
                  .catch(err => next(err));
    }catch(e){
      next(e)
    }
}

exports.updateWaterSettings = async (req, res, next) => {
    
    const waterSettingsID = req.params.waterSettingsID;

    try
    {
      let {userID}=req.body;
      const waterSettings = {
        userID:Number(userID),
        isDefault:0,
        dailyGoals:Number(req.body.dailyGoals),
        cupSize:Number(req.body.cupSize),
        waterReminder:Boolean(req.body.waterReminder),
        timeInterval:Number(req.body.timeInterval),
        start:req.body.start,
        end:req.body.end,
        createdByUserID:Number(userID),
        lastUpdatedUserID:Number(userID),
        isActive:1
    }
      let querystring = `select 1 from waterSettings where userID=:userID and isActive=1`;
      let isExiest= await sequelize.query(querystring, { replacements: { userID },
                type: sequelize.QueryTypes.SELECT
              })
       console.log("water settings exist",isExiest)       
       if(isExiest[0])
       {       
       await models.waterSettings.update(waterSettings, {
            where: { waterSettingsID : waterSettingsID }
        })
        .then(update => {
            if(update == 1)
            {
                res.send({
                    status: 200,
                    message: "waterSettings updated successfully!"
                })
            }
            else{
                res.send({
                    message: "Cannot update the waterSettings!"
                })
            }
        })
        .catch(err => {
            res.send({
                status: 400,
                message: "Error occured while updating waterSettings"
            })
        })
      }
      else{
      await  models.waterSettings.create(waterSettings)
        .then(waterSettings => {
            res.send({
                status: 200,
                data: waterSettings,
                message: "WaterSettings added succsessfully!"
            })
        })
        .catch(err => {
            res.send({
                status: 400,
                message: "Error occured while adding WaterSettings!"
            })
            console.log("Req, ", err );
        })
      }
    }
    catch(e)
    {

    }
}

  exports.waterIntaking = async (req, res, next) => {
    console.log("waterIntake")
    // var userID = helper.getIdFromToken(req.headers['authorization']);
    var userID=req.body.userID;
    try {
        const waterIntake = {
            userID:Number(userID),
            waterSettingsID:Number(req.body.waterSettingsID),
            intake:Number(req.body.intake),
            goal:Number(req.body.goal),
            createdByUserID:Number(userID),
            lastUpdatedUserID:Number(userID),
            isActive:1
        }
        console.log(waterIntake);
        // console.log("Req, ", req );

        models.waterIntake.create(waterIntake)
            .then(intake => {
                res.send({
                    status: 200,
                    data: intake,
                    message: "waterIntake added succsessfully!"
                })
            })
            .catch(err => {
                res.send({
                    status: 400,
                    message: "Error occured while adding waterIntake!"
                })
                console.log("Req, ", err );
            })
    }
    catch (e) {
        next(e);
    }

} 

exports.waterHistory = async(req, res, next) =>{
    try{
      // var userID = helper.getIdFromToken(req.headers['authorization']);
      let {userID, to, from} = req.query;
      let querystring = `select SUM(intake)intake,createdAt from (select intake,goal,CAST(createdAt as DATE)createdAt,userID from waterIntake where 
      userID=:userID and isActive=1 and createdAt  BETWEEN CAST( :from as DATETIME) and  CAST( :to as DATETIME))A GROUP BY createdAt ORDER BY createdAt DESC`;

          sequelize
                  .query(querystring, {
                    replacements: {userID:userID,from:from,to:to},
                    type: sequelize.QueryTypes.SELECT
                  })
                  .then(waterHistory => {
                    res.send({
                      status: 200,
                      data: waterHistory,
                      message:
                        "Water History found successfully"
                    });
                  })
                  .catch(err => next(err));
    }catch(e){
      next(e)
    }
}

  exports.waterTodaysRecord = async(req, res, next) =>{
    try{
      // var userID = helper.getIdFromToken(req.headers['authorization']);
      let {userID,to,from}=req.query;
      let querystring = `select intake,createdAt from waterIntake where userID=:userID and createdAt BETWEEN CAST(:from as DATETIME) AND CAST(:to as DATETIME) ORDER BY createdAt DESC `;

          sequelize
                  .query(querystring, {
                    replacements: {userID:userID,to,from},
                    type: sequelize.QueryTypes.SELECT
                  })
                  .then(waterTodaysRecord => {
                    res.send({
                      status: 200,
                      data: waterTodaysRecord,
                      message:
                        "Water Today's Record found successfully"
                    });
                  })
                  .catch(err => next(err));
    }catch(e){
      next(e)
    }
}  
