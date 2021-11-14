"use strict";

module.exports = (sequelize, DataTypes) => {
    const WATER_INTAKE = sequelize.define("waterIntake", {
        waterIntakeID: {
            field: "waterIntakeID",
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        intake: {
            field: "intake",
            type: DataTypes.INTEGER,
        },
        goal: {
            field: "goal",
            type: DataTypes.INTEGER,
        },
        isActive: {
            field: "isActive",
            type: DataTypes.BOOLEAN,
            default: 1
        }        
    },
    {
        tableName: "waterIntake"
    });
    WATER_INTAKE.associate = (models) => {
        WATER_INTAKE.belongsTo(models.users, {
            foreignKey: "userID"
         });
         WATER_INTAKE.belongsTo(models.waterSettings, {
            foreignKey: "waterSettingsID"
         }); 
        WATER_INTAKE.belongsTo(models.users, {
          foreignKey: "createdByUserID"
        });

        WATER_INTAKE.belongsTo(models.users, {
          foreignKey: "lastUpdatedUserID"
        });
    };
    return WATER_INTAKE;
}